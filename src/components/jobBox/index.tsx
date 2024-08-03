import styles from './styles.module.css';

interface JobBoxProps {
  title: string;
  company: string;
  datePosted: string;
  link: string;
  siteSource: string
}
export function JobBox(props: JobBoxProps) {
  return <a className={styles.jobBox} href={props.link} target='blank'>
    <p>{props.title}</p>
    <p>{props.company}</p>
    <p>{props.siteSource}</p>
    <time>{new Date(props.datePosted).toLocaleString()}</time>
  </a>
}
