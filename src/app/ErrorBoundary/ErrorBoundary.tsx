import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";
import styles from "./ErrorBoundary.module.css";
import buttonStyles from "../../shared/ui/Button/Button.module.css";
import Button from "../../shared/ui/Button/Button";
import { URLS } from "@app/router/urls";

const ErrorBoundary = () => {
  const error = useRouteError();

  let errorMessage = "Что-то пошло не так";
  let errorDetails = "Произошла неизвестная ошибка";
  let statusCode = "ERROR";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status.toString();
    errorMessage = error.statusText || "Ошибка сервера";
    errorDetails = error.data?.message || "Попробуйте обновить страницу";
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails =
      error.stack?.split("\n")[0] || "Проверьте консоль для деталей";
  }

  return (
    <div className={styles.errorBoundary}>
      <div className={styles.errorContent}>
        <div className={styles.glitchWrapper}>
          <div className={styles.glitch} data-text={statusCode}>
            {statusCode}
          </div>
        </div>

        <h1 className={styles.title}>{errorMessage}</h1>
        <p className={styles.description}>{errorDetails}</p>

        <div className={styles.actions}>
          <Button
            onClick={() => window.location.reload()}
            ariaLabel="Обновить страницу"
          >
            Обновить страницу
          </Button>

          <Link
            to={URLS.MENU}
            className={`${buttonStyles.button} ${buttonStyles.secondary} ${styles.link}`}
          >
            <span className={styles.linkText}>Вернуться на главную</span>
            <span className={styles.linkArrow}>→</span>
          </Link>
        </div>

        <div className={styles.decorCircle}></div>
        <div className={styles.decorCircle}></div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
