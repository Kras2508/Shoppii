import { Server } from 'socket.io'

let io

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Join user room
    socket.on('join', (userId) => {
      socket.join(userId)
      console.log(`User ${userId} joined room`)
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  console.log('Socket.IO initialized')
  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!')
  }
  return io
}