# Amai Backend Architecture (Scalable Monolith -> Microservices)

## Folder Structure

```txt
backend/
├── database/
│   └── schema.sql
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   └── jwt.js
│   └── modules/
│       ├── auth/
│       │   ├── auth.controller.js
│       │   ├── auth.service.js
│       │   ├── auth.repository.js
│       │   └── auth.routes.js
│       ├── products/
│       │   ├── product.controller.js
│       │   ├── product.service.js
│       │   ├── product.repository.js
│       │   └── product.routes.js
│       ├── cart/
│       │   ├── cart.controller.js
│       │   ├── cart.service.js
│       │   ├── cart.repository.js
│       │   └── cart.routes.js
│       └── orders/
│           └── order.routes.js
└── .env.example
```

## Design Notes

- **Gateway-first layout:** `app.js` mounts all public APIs under `/api/v1`, so this file can later become a dedicated API Gateway/BFF.
- **Controller-Service-Repository boundaries:**
  - Controller: HTTP + validation boundary.
  - Service: business logic and orchestration.
  - Repository: persistence (PostgreSQL queries).
- **Redis usage:** catalog response caching with short TTL in `products` service.
- **Future microservice split:** each `modules/*` directory can move to standalone service with minimal refactor (keep route/controller/service/repo contracts).
