.PHONY: deploy rebuild ssh logs ps up down restart prune key

# ===========================================
# Frontend (Next.js) production deployment
# ===========================================
# Deploys to the same EC2 box as the backend, into ~/medigo-interface.
# Override any var per-command, e.g.  make deploy PROD_HOST=1.2.3.4
PROD_HOST ?= 15.222.199.206
PROD_USER ?= ec2-user
SSH_KEY   ?= ../Medigo-Backend/medigo-prod
APP_DIR   ?= /home/ec2-user/medigo-interface

# PubkeyAcceptedAlgorithms re-enables RSA-SHA2 for the RSA key
# (newer OpenSSH disables ssh-rsa by default -> "Permission denied (publickey)").
SSH = ssh -i $(SSH_KEY) -o StrictHostKeyChecking=accept-new \
	-o PubkeyAcceptedAlgorithms=+ssh-rsa,rsa-sha2-512,rsa-sha2-256 \
	-o IdentitiesOnly=yes $(PROD_USER)@$(PROD_HOST)

# SSH refuses keys with loose permissions; fix them before connecting.
key:
	@chmod 600 $(SSH_KEY) 2>/dev/null || true

# Full deploy: pull latest code, rebuild the image, restart, then reclaim build
# cache (the --no-cache build fills /mnt/docker-data otherwise).
deploy: key
	$(SSH) 'cd $(APP_DIR) && git pull && docker compose build --no-cache && docker compose up -d && docker builder prune -af'

# Rebuild & restart from the current working tree on the server (no git pull).
rebuild: key
	$(SSH) 'cd $(APP_DIR) && docker compose build --no-cache && docker compose up -d && docker builder prune -af'

# Open an interactive shell on the server.
ssh: key
	$(SSH)

# Tail the frontend container logs.
logs: key
	$(SSH) 'cd $(APP_DIR) && docker compose logs -f --tail=100'

# Show the running container.
ps: key
	$(SSH) 'cd $(APP_DIR) && docker compose ps'

# Start / stop / restart without rebuilding.
up: key
	$(SSH) 'cd $(APP_DIR) && docker compose up -d'

down: key
	$(SSH) 'cd $(APP_DIR) && docker compose down'

restart: key
	$(SSH) 'cd $(APP_DIR) && docker compose restart'

# Reclaim docker disk (dangling images + build cache on /mnt/docker-data).
prune: key
	$(SSH) 'docker image prune -f && docker builder prune -af'
