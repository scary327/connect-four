# Connect 4 (4 в ряд)

Веб-проекты: игра "4 в ряд" с поддержкой локальных сессий, тем, переводов и алгоритмического бота на Rust (WebAssembly).

## Как запустить

- Docker-контейнер:
  Среднее время скачивания 10 минут!

  <p><strong><span style="color:#b00020; background-color:#fff1f0; padding:6px 8px; border-radius:4px; font-size:1.05em;">Внимание: загрузка образа может занять около 10 минут из‑за проблем с Docker в России — пожалуйста, будьте готовы подождать.</span></strong></p>

```bash
git clone git@github.com:scary327/connect-four.git
cd connect-four
docker build -t connect4 .
docker run -p 5173:5173 connect4
# затем откройте http://localhost:5173
```

## Основные фичи

- Переводы (i18n): приложение поддерживает английский (en), русский (ru) и испанский (es). Переводы лежат в `public/locales/<lng>/<namespace>.json` и загружаются по namespace с помощью i18next/react-i18next.

- Темы: светлая и тёмная тема, переключение сохраняется в localStorage и применяется без перезагрузки.

- Смена анимации падения фишек: доступны стили анимации (например, "Drop" - анимация падения внутри клетки и "Fall" - анимация падения по всей колонке) — выбор влияет на визуальное поведение фишек при постановке.

- Бот на Rust + WebAssembly: основная логика бота в `wasm/connect4_bot` (функция `compute_move`). Варианты сложности: `easy`, `medium`, `insane` (от простых эвристик до minimax/alpha-beta). WASM собирается через `wasm-pack` и подключается в фронтенд.
