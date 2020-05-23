setup:
	docker volume create nodemodules
install:
	docker-compose	-f docker-compose.builder.yml run --rm install
dd:
	docker-compose	-f docker-compose.builder.yml run dev
dev:
	docker-compose up
down:
	docker-compose down