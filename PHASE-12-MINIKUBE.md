# Phase 12: Minikube and Kubernetes

## Simple mental model

- **Kubernetes** is a system that schedules and manages containers across machines.
- Kubernetes is used to keep applications running, restart failed containers, provide stable networking, and manage deployments declaratively.
- **Minikube** runs a small Kubernetes cluster locally for learning and development.
- A **container** is one running packaged process. A **Pod** is Kubernetes' smallest runnable unit and contains one or more closely coupled containers. This project uses one application container per Pod.
- A **Deployment** declares the desired number and version of Pods and replaces unhealthy Pods.
- A **Service** gives Pods a stable DNS name and virtual IP, even when Pods are recreated.
- A **Namespace** groups and isolates Kubernetes resources. This project uses the `hotel` namespace.
- A **ConfigMap** stores non-secret configuration such as the database host and port.
- A **Secret** stores sensitive configuration such as a database password. Kubernetes Secrets are not automatically encrypted for every storage setup, so this demo Secret is only for local learning.
- **Docker** builds and runs containers. **Kubernetes** coordinates containers and their networking, storage, health checks, and rollouts. Kubernetes does not replace Docker image builds.

## Files added

The [`k8s`](k8s) directory contains:

- `namespace.yaml`: the `hotel` namespace.
- `postgres-secret.yaml`: local PostgreSQL credentials.
- `backend-config.yaml`: database host, port, and name.
- `postgres.yaml`: PostgreSQL Deployment, Service, and 1 GiB PersistentVolumeClaim.
- `backend.yaml`: backend Deployment and ClusterIP Service.
- `frontend.yaml`: frontend Deployment and NodePort Service.

The database uses a PersistentVolumeClaim so a PostgreSQL Pod restart does not discard its local data. This is intentionally a small learning setup, not a production database design.

## Prerequisites

Install and verify Docker Desktop, Minikube, and kubectl. Run these commands in PowerShell from the repository root:

```powershell
minikube version
kubectl version --client
docker version
```

## Start Minikube

```powershell
minikube start --driver=docker
kubectl get nodes
```

The node should eventually show `Ready`.

## Build images for Minikube

Build the application images inside Minikube's image environment. This avoids pushing them to a registry:

```powershell
minikube image build -t hotel-backend:latest .\backend
minikube image build -t hotel-frontend:latest .\frontend
minikube image ls | Select-String 'hotel-'
```

The Deployments use `imagePullPolicy: Never`, so Kubernetes uses these local images and does not try to download them.

## Apply the manifests

Apply the namespace first because namespaced resources cannot be created before it exists:

```powershell
kubectl apply -f .\k8s\namespace.yaml
kubectl apply -f .\k8s
```

All application resources are in the `hotel` namespace. Check them with:

```powershell
kubectl get all -n hotel
kubectl get pvc -n hotel
kubectl get configmap,secret -n hotel
```

## Wait for startup and inspect logs

```powershell
kubectl rollout status deployment/postgres -n hotel --timeout=120s
kubectl rollout status deployment/backend -n hotel --timeout=180s
kubectl rollout status deployment/frontend -n hotel --timeout=120s
kubectl get pods -n hotel -o wide
```

View logs:

```powershell
kubectl logs deployment/postgres -n hotel
kubectl logs deployment/backend -n hotel
kubectl logs deployment/frontend -n hotel
```

Follow backend logs live with `-f` and press `Ctrl+C` to stop following.

## Access the application

The frontend Service is a NodePort. Let Minikube open it:

```powershell
minikube service frontend -n hotel
```

Or print the URL:

```powershell
minikube service frontend -n hotel --url
```

Open the printed URL. Nginx sends `/api/` requests to the Kubernetes `backend` Service, and the backend connects to the `postgres` Service through cluster DNS.

## Check services and connectivity

```powershell
kubectl get services -n hotel
kubectl describe service frontend -n hotel
kubectl describe service backend -n hotel
kubectl get endpoints -n hotel
```

An empty endpoint list usually means the Service selector does not match a ready Pod. These manifests use matching `app` labels and selectors.

## Troubleshooting failed Pods

Start with:

```powershell
kubectl get pods -n hotel
kubectl describe pod <pod-name> -n hotel
kubectl logs <pod-name> -n hotel --all-containers
kubectl get events -n hotel --sort-by=.lastTimestamp
```

Common causes:

- `ImagePullBackOff`: rebuild with `minikube image build` and confirm the exact image tag.
- `CrashLoopBackOff`: inspect logs; for the backend, verify PostgreSQL is Ready and the database environment variables are present.
- `Pending`: inspect the Pod and PVC; Minikube's storage provisioner must be enabled.
- Backend readiness failures: wait for PostgreSQL, then inspect backend logs and `kubectl describe pod`.
- Frontend returns `502`: confirm the backend Pod is Ready and that `kubectl get endpoints backend -n hotel` lists an endpoint.

To restart this learning deployment from scratch while retaining the cluster:

```powershell
kubectl delete namespace hotel
kubectl apply -f .\k8s\namespace.yaml
kubectl apply -f .\k8s
```

To stop or remove Minikube:

```powershell
minikube stop
minikube delete
```

`minikube delete` removes the local cluster and its local volumes, including the demo database data.
