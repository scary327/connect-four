import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import buttonStyles from "../../shared/ui/Button/Button.module.css";
import { URLS } from "@app/router/urls";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <div className={styles.code404}>
          <span className={styles.digit}>4</span>
          <span className={styles.digit}>0</span>
          <span className={styles.digit}>4</span>
        </div>

        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.description}>
          Кажется, вы попали в цифровую пустоту. Страница, которую вы ищете, не
          существует или была перемещена.
        </p>

        <div className={styles.actions}>
          <Link
            to={URLS.MENU}
            className={`${buttonStyles.button} ${buttonStyles.primary} ${styles.primaryButton}`}
          >
            <span className={styles.buttonText}>На главную</span>
            <span className={styles.buttonGlow}></span>
          </Link>

          <Link
            to={URLS.GAME}
            className={`${buttonStyles.button} ${buttonStyles.secondary} ${styles.secondaryButton}`}
          >
            <span>Начать игру</span>
          </Link>
        </div>

        <div className={styles.grid}></div>
      </div>
    </div>
  );
};

export default NotFound;
