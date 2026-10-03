# E-commerce - Servicio de notificaciones por correo (Arquitectura Hexagonal)

Puerto de salida `EmailServicePort` + adaptador `NodemailerAdapter`.

## Ejecutar
    cd backend && npm install && cp .env.example .env   # completar credenciales Mailtrap
    npm test && npm start
    cd frontend && npm run dev                           # usar Checkout.jsx en tu app Vite/React

## Prueba rapida sin frontend
    curl -X POST http://localhost:4000/api/orders -H "Content-Type: application/json" \
      -d '{"customer":{"name":"Ana","email":"ana@test.com","phone":"9611234567"},"items":[{"name":"Playera","price":250,"quantity":2}]}'
