import React, { memo } from "react";
import styles from "./SettingSection.module.css";
import Typography from "@shared/ui/Typography/Typography";

interface SettingSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const SettingSection: React.FC<SettingSectionProps> = memo(
  ({ title, description, children, className = "" }) => {
    return (
      <section className={`${styles.section} ${className}`}>
        <div className={styles.row}>
          <div className={styles.left}>
            <Typography.H2 className={styles.title}>{title}</Typography.H2>
            {description && (
              <Typography.Muted className={styles.description}>
                {description}
              </Typography.Muted>
            )}
          </div>

          <div className={styles.right}>{children}</div>
        </div>
      </section>
    );
  }
);

SettingSection.displayName = "SettingSection";

export default SettingSection;
