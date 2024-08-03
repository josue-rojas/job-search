import styles from './styles.module.css';

interface JobBoxProps {
  title: string;
  company: string;
  datePosted: string;
  link: string;
  siteSource: string
}
export function JobBox(props: JobBoxProps) {
  return (
    <a className={styles.jobBox} href={props.link} target='_blank' rel='noopener noreferrer'>
      <div className={styles.header}>
        <p className={styles.title}>{props.title}</p>
        <p className={styles.company}>{props.company}</p>
        <p className={styles.siteSource}>{props.siteSource}</p>
      </div>
      <time className={styles.date}>{new Date(props.datePosted).toLocaleString()}</time>
    </a>
  );
}
