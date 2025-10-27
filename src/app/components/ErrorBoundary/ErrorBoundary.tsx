import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import styles from "./ErrorBoundary.module.css";
import Button from "../../../shared/ui/Button/Button";
import { URLS } from "@app/router/urls";
import Typography from "@shared/ui/Typography/Typography";

const ErrorBoundary = () => {
  const error = useRouteError();

  let statusCode = "ERROR";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status.toString();
  } else if (error instanceof Error) {
    statusCode = "ERROR";
  }

  return (
    <div className={styles.errorBoundary}>
      <div className={styles.errorContent}>
        <div className={styles.glitchWrapper}>
          <div className={styles.glitch} data-text={statusCode}>
            {statusCode}
          </div>
        </div>

        <Typography.H1 className={styles.title}>
          Что-то пошло не так
        </Typography.H1>
        <Typography.Body className={styles.description}>
          Произошла ошибка. Пожалуйста, обновите страницу или вернитесь на
          главную.
        </Typography.Body>

        <div className={styles.actions}>
          <Button
            onClick={() => window.location.reload()}
            ariaLabel="Обновить страницу"
          >
            Обновить страницу
          </Button>

          <Button to={URLS.MENU} variant="secondary">
            Вернуться на главную →
          </Button>
        </div>

        <div className={styles.decorCircle}></div>
        <div className={styles.decorCircle}></div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
