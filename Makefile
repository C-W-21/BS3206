
dev-env-up:
	docker compose -f docker/docker-compose.yaml -f docker/docker-compose.dev.yaml up

dev-env-down:
	docker compose -f docker/docker-compose.yaml -f docker/docker-compose.dev.yaml down

prd-env-up:
	docker compose -f docker/docker-compose.yaml up --build

prd-env-down:
	docker compose -f docker/docker-compose.yaml down

test-backend:
	docker compose -f docker/docker-compose.backend.test.yaml run --rm newman
