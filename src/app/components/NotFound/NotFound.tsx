import styles from "./NotFound.module.css";
import Button from "../../../shared/ui/Button/Button";
import { URLS } from "@app/router/urls";
import Typography from "@shared/ui/Typography/Typography";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation("components");

  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <div className={styles.code404}>
          <span className={styles.digit}>4</span>
          <span className={styles.digit}>0</span>
          <span className={styles.digit}>4</span>
        </div>

        <Typography.H1 className={styles.title}>
          {t("notFound.title")}
        </Typography.H1>
        <Typography.Body className={styles.description}>
          {t("notFound.description")}
        </Typography.Body>

        <div className={styles.actions}>
          <Button to={URLS.MENU} variant="primary">
            {t("notFound.home")}
          </Button>

          <Button to={URLS.GAME} variant="secondary">
            {t("notFound.startGame")}
          </Button>
        </div>

        <div className={styles.grid}></div>
      </div>
    </div>
  );
};

export default NotFound;
