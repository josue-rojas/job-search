import { useState } from 'react';
import styles from './styles.module.css';

interface JobBoxProps {
  jobId: number;
  title: string;
  company: string;
  datePosted: string;
  link: string;
  siteSource: string;
  onRemove: (id: number) => Promise<unknown>;  // Callback to handle removal request
  onRemoveSuccess: () => void;    // Callback for successful removal
}

export function JobBox(props: JobBoxProps) {
  const [removing, setRemoving] = useState(false);  // To manage the loading state

  const handleRemoveClick = async () => {
    setRemoving(true);
    try {
      let response = await props.onRemove(props.jobId);  // Send the request
      // TODO: this could be written better. mayb pass down the type too or set it in the props
      if ((response as any).success) {
        props.onRemoveSuccess();  
      }
    } catch (error) {
      console.error('Error removing job:', error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className={styles.jobBoxContainer}>
      <a className={styles.jobBox} href={props.link} target='_blank' rel='noopener noreferrer'>
        <div className={styles.header}>
          <p className={styles.title}>{props.title}</p>
          <p className={styles.company}>{props.company}</p>
          <p className={styles.siteSource}>{props.siteSource}</p>
        </div>
        <time className={styles.date}>{new Date(props.datePosted).toLocaleString()}</time>
      </a>
      {/* TODO: not show for now since idk if it's a good use for this */}
      {/* <button 
        className={styles.removeButton} 
        onClick={handleRemoveClick}
        disabled={removing}  // Disable the button while the request is processing
      >
        {removing ? 'Removing...' : 'X'}
      </button> */}
    </div>
  );
}
