import os
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine, Base
from seed_data import seed_database
from routers import auth, transactions, benefits, claims, ocr, analytics, chat

# Seed database on startup
seed_database()

app = FastAPI(
    title="BenefitGuard AI - Card Benefit Activation Engine API",
    description="Real-Time Payment Card Insurance & Protection Benefit Detection, Claim Auto-Fill, and Fraud Scoring Engine.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(benefits.router)
app.include_router(claims.router)
app.include_router(ocr.router)
app.include_router(analytics.router)
app.include_router(chat.router)

# WebSocket Connection Manager for Real-Time Streaming
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

ws_manager = ConnectionManager()

@app.websocket("/ws/transactions")
async def websocket_transactions(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast incoming transaction event to connected clients
            await ws_manager.broadcast({"type": "TXN_EVENT", "data": json.loads(data)})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# Serve Production Frontend Build if available
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

@app.get("/")
def root():
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        from fastapi.responses import FileResponse
        return FileResponse(index_path)
    return {
        "system": "BenefitGuard AI Engine",
        "status": "ONLINE",
        "version": "1.0.0",
        "documentation": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

