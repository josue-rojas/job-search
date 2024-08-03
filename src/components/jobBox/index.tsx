import styles from './styles.module.css';

interface JobBoxProps {
  title: string;
  company: string;
  datePosted: string;
  link: string;
}
export function JobBox(props: JobBoxProps) {
  return <a className={styles.jobBox} href={props.link}>
    <p>{props.title}</p>
    <p>{props.company}</p>
    <time>{new Date(props.datePosted).toLocaleDateString()}</time>
  </a>
}