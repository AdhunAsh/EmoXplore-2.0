import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """ Called when WebSocket connection is opened """
        await self.accept()  # Accept WebSocket connection
        await self.send(text_data=json.dumps({"message": "WebSocket Connected!"}))

    async def disconnect(self, close_code):
        """ Called when WebSocket connection is closed """
        print("WebSocket Disconnected")

    async def receive(self, text_data):
        """ Called when the server receives a message from the client """
        data = json.loads(text_data)
        message = data["message"]

        # Send a response message
        await self.send(text_data=json.dumps({"message": f"Received: {message}"}))
