import styles from "./NotFound.module.css";
import Button from "../../../shared/ui/Button/Button";
import { URLS } from "@app/router/urls";
import Typography from "@shared/ui/Typography/Typography";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <div className={styles.code404}>
          <span className={styles.digit}>4</span>
          <span className={styles.digit}>0</span>
          <span className={styles.digit}>4</span>
        </div>

        <Typography.H1 className={styles.title}>
          Страница не найдена
        </Typography.H1>
        <Typography.Body className={styles.description}>
          Кажется, вы попали в цифровую пустоту. Страница, которую вы ищете, не
          существует или была перемещена.
        </Typography.Body>

        <div className={styles.actions}>
          <Button to={URLS.MENU} variant="primary">
            На главную
          </Button>

          <Button to={URLS.GAME} variant="secondary">
            Начать игру
          </Button>
        </div>

        <div className={styles.grid}></div>
      </div>
    </div>
  );
};

export default NotFound;
