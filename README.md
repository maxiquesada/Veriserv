# VeriServ — Plataforma de servicios del hogar con reputación verificable

## Stack | Costo inicial: $0–$10/mes

| Capa | Tecnología | Hosting | Costo |
|------|-----------|---------|-------|
| Frontend | React 18 + Tailwind | Vercel | Gratis |
| Backend | FastAPI (Python) | Railway | Gratis |
| Base de datos | PostgreSQL | Supabase | Gratis (500MB) |
| Imágenes | Cloudinary | Cloudinary | Gratis (25GB) |
| Dominio | — | Namecheap/NIC.ar | ~$10/año |

---

## Estructura

```
veriserv/
├── backend/
│   ├── app/
│   │   ├── api/routes/   → auth, users, contractors, jobs, reviews, admin
│   │   ├── core/         → config.py, security.py
│   │   ├── db/           → database.py
│   │   ├── models/       → base.py (todos los modelos ORM)
│   │   └── schemas/      → schemas.py (Pydantic)
│   ├── main.py
│   ├── requirements.txt
│   ├── Procfile          → para Railway
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/        → Home, Search, Profile, Login, Register, Dashboard, Admin
    │   ├── components/   → Layout, ContractorCard, ReviewForm, SearchFilters
    │   ├── services/     → api.js (axios)
    │   └── store/        → authStore.js (zustand)
    ├── index.html
    ├── package.json
    └── .env.example
```

---

## Setup local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # completar con tus credenciales
uvicorn app.main:app --reload --port 8000
```

Documentación interactiva: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env.local
npm run dev
```

---

## Deploy (100% gratuito)

### 1. Supabase (base de datos)
1. Crear proyecto en supabase.com
2. Settings → Database → Connection string (URI)
3. Copiar URL a `DATABASE_URL` en el .env

### 2. Cloudinary (imágenes)
1. Crear cuenta en cloudinary.com
2. Dashboard → API Keys
3. Copiar `cloud_name`, `api_key`, `api_secret`

### 3. Railway (backend)
1. railway.app → New Project → Deploy from GitHub
2. Seleccionar carpeta `/backend`
3. Agregar variables de entorno desde el panel
4. El `Procfile` ya está configurado

### 4. Vercel (frontend)
1. vercel.com → Import Git Repository → `/frontend`
2. Agregar variable: `VITE_API_URL` = URL de Railway

---

## Primer usuario admin

En Supabase → SQL Editor:
```sql
UPDATE usuarios SET tipo = 'admin' WHERE email = 'tu@email.com';
```

---

## Roadmap v2
- [ ] Google OAuth
- [ ] Notificaciones email (Resend)
- [ ] Verificación automática de trabajos
- [ ] Pagos (Mercado Pago)
- [ ] App mobile (React Native)
