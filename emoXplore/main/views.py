import json
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse
from deepface import DeepFace
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail  
from django.contrib import messages
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import *
from .forms import *



def login_user(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        remember_me = request.POST.get('remember_me')  # Check if the checkbox is selected
        user = authenticate(request, username = username, password = password)
        if user is not None:
            login(request , user)
            if remember_me:
                request.session.set_expiry(1209600)  # 2 weeks
            else:
                request.session.set_expiry(0)  # Close session when the browser is closed
                
            return redirect('home')
        else:
            messages.success(request, ("There was an Error Logging in..Try Again...."))
            return redirect('login')
            
    return render(request , 'main/login.html')


def register_user(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        if password1 != password2:
            messages.error(request, "Passwords do not match!")
            return redirect('register')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken!")
            return redirect('register')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already registered!")
            return redirect('register')

        # Create the user
        user = User.objects.create_user(username=username, email=email, password=password1)
        user.save()

        messages.success(request, "Account created successfully! Please log in.")
        return redirect('login')

    return render(request, 'main/register.html')  # You can reuse the login page if you want

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

@csrf_exempt
@login_required
def home(request):
    chat_group = get_object_or_404(ChatGroup, group_name='Hey_Explorers')
    chat_messages = chat_group.chat_messages.all()[:30]
    form = ChatmessageCreateForm()

    # Handle chat message via HTMX
    if request.htmx:
        form = ChatmessageCreateForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.author = request.user
            message.group = chat_group
            message.save()
            return render(request, 'main/partial/chat_message_p.html', {
                'message': message,
                'user': request.user
            })

    # Handle image and emotion
    if request.method == "POST":
        try:
            image_data = request.POST.get("imageData")
            if not image_data:
                return JsonResponse({"error": "No image data received"}, status=400)

            analysis = DeepFace.analyze(image_data, actions=["emotion"])
            detected_emotion = analysis[0]["dominant_emotion"]

            with open("./emotion_mapping.json", "r") as f:
                parsed_data = json.load(f)

            emotion_info = parsed_data.get(detected_emotion)
            return render(request, "main/Homepage.html", {
                "data": emotion_info,
                "emotion": detected_emotion,
                "chat_messages": chat_messages,
                "form": form
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except ValueError:
            return render(request, "main/Homepage.html", {
                "error_message": "Face not detected! Align your face properly.",
                "chat_messages": chat_messages,
                "form": form
            })

    # Normal GET request
    return render(request, "main/Homepage.html", {
        "chat_messages": chat_messages,
        "form": form
    })


def landing(request):
    emotion = request.GET.get("emotion") #emotion from the previous page
    category = request.GET.get("category")  
    print(f"emotion recieved : {emotion}")
    # print(f"category recieved : {category}")
    with open("./emotion_mapping.json" , "r") as f :
        data = f.read()
        emotion_data = json.loads(data)
        
    # #extract relevant data
    selected_data =  emotion_data.get(emotion , {})
    categories = selected_data.get("categories" , [])
    
    category_data = None
    for cat in categories :
        if cat["name"] == category:
            category_data = cat
            break     
    
    places = []
    
    if category_data: 
        for option in category_data.get("options" , [] ):        
            name = option.get("name")
            places.append({
                "name" : name ,
                "desc" : option.get("description"),
                "image" : option.get("image"),
                "loc" : option.get("location")
                
            })
    # print(f"Places: {places}")
        
    return render(request, "main/Landing_page.html" , {"places" : places})

#e-mail setup

def contact(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("suggestion")

        try:
            send_mail(
                subject=f"Contact Form Submission from {name}",
                message=f"Sender Email: {email}\n\n{message}",
                from_email=settings.EMAIL_HOST_USER,  # Your sender email
                recipient_list=[settings.EMAIL_HOST_USER],  # Receiver email
                fail_silently=False,
            )
            messages.success(request, "Your message has been sent successfully!")
        except Exception as e:
            print(request, f"An error occurred: {str(e)}")

        return redirect("contact")

    return render(request, "main/contact.html")
    
    
def file_upload(request):
    chatroom_name = "Hey_Explorers"
    chat_group = get_object_or_404(ChatGroup, group_name = chatroom_name)
    
    if request.htmx and request.FILES:
        file = request.FILES['file']
        message = GroupMessage.objects.create(
            file = file,
            author = request.user,
            group = chat_group,
        )
        channel_layer = get_channel_layer()
        
        event = {
            'type' : 'message_handler',
            'message_id' : message.id,
        }
        
        async_to_sync(channel_layer.group_send)(
            chatroom_name, event
        )
        return HttpResponse()
    