# PR #13 — GitHub Actions: деплой на удалённый сервер при пуше в develop

**Дата:** 2026-07-09

## Обзор

Добавлен автоматический деплой на удалённую машину при каждом пуше в ветку `develop`. Деплой выполняется по SSH: на сервере подтягивается актуальный код и пересобираются контейнеры через Docker Compose.

## Что изменено

### GitHub Actions

- `.github/workflows/deploy-develop.yml` — workflow с триггером `push` на `develop`, concurrency-группой и шагом деплоя через `appleboy/ssh-action`.

### Скрипт деплоя

- `scripts/deploy-remote.sh` — обновление репозитория до `origin/develop`, `docker compose build --pull`, `docker compose up -d`, очистка неиспользуемых образов.

### Настройка сервера и секретов

На удалённой машине должны быть установлены Git, Docker и Docker Compose. Репозиторий клонируется в каталог, путь к которому задаётся секретом `DEPLOY_PATH`.

В настройках репозитория GitHub (**Settings → Secrets and variables → Actions**) нужно добавить:

| Секрет | Описание |
|--------|----------|
| `DEPLOY_HOST` | IP или hostname сервера |
| `DEPLOY_USER` | SSH-пользователь |
| `DEPLOY_SSH_KEY` | Приватный SSH-ключ (полностью, включая `-----BEGIN ...`) |
| `DEPLOY_PATH` | Абсолютный путь к клону репозитория на сервере |
| `DEPLOY_PORT` | *(опционально)* SSH-порт, по умолчанию `22` |

Публичный ключ от `DEPLOY_SSH_KEY` добавляется в `~/.ssh/authorized_keys` на сервере.

Первичная подготовка сервера:

```bash
git clone <repo-url> /opt/cosmetric-api
cd /opt/cosmetric-api
git checkout develop
docker compose up -d
```

При необходимости production-переменные (`DATABASE_URL` и др.) задаются в `.env` на сервере или через override `docker-compose`.
