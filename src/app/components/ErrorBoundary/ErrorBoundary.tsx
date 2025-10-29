import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import styles from "./ErrorBoundary.module.css";
import Button from "../../../shared/ui/Button/Button";
import { URLS } from "@app/router/urls";
import Typography from "@shared/ui/Typography/Typography";
import { useTranslation } from "react-i18next";

const ErrorBoundary = () => {
  const error = useRouteError();

  const { t } = useTranslation("components");

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
          {t("errorBoundary.title")}
        </Typography.H1>
        <Typography.Body className={styles.description}>
          {t("errorBoundary.description")}
        </Typography.Body>

        <div className={styles.actions}>
          <Button
            onClick={() => window.location.reload()}
            ariaLabel={t("errorBoundary.reload")}
          >
            {t("errorBoundary.reload")}
          </Button>

          <Button to={URLS.MENU} variant="secondary">
            {t("errorBoundary.home")}
          </Button>
        </div>

        <div className={styles.decorCircle}></div>
        <div className={styles.decorCircle}></div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
