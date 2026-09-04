# Hotel Management — DevSecOps Learning Project

A simple full-stack Hotel Management app used to learn an end-to-end CI/CD + DevSecOps pipeline
(GitHub Actions, Jenkins, Docker, Kubernetes/Minikube, Gitleaks, Trivy).

> This README will grow as each phase of the project is completed.
> Current status: **Phase 12 — Minikube manifests and local deployment guide added.**

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite |
| Backend | Java 21 + Spring Boot 3 + Maven |
| Database | PostgreSQL (added in a later phase) |

## Project structure

```text
project/
├── frontend/    # React + Vite single-page app
├── backend/     # Spring Boot REST API
├── database/    # DB init scripts / migrations (added later)
├── k8s/         # Minikube Kubernetes manifests
├── docker/      # Dockerfiles / compose (added later)
├── Jenkinsfile  # Jenkins pipeline (added later)
└── .github/workflows/  # GitHub Actions pipelines (added later)
```

## Running locally (Phase 1)

**Backend** (http://localhost:8080):

```bash
cd backend
mvn spring-boot:run
```

**Frontend** (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in a browser — it fetches `GET /api/rooms` from the backend and
renders a table of rooms.

## Learning phases

- [Phase 11: self-hosted GitHub Actions runner](PHASE-11-SELF-HOSTED-RUNNER.md)
- [Phase 12: Minikube and Kubernetes](PHASE-12-MINIKUBE.md)
