import React from 'react'
import AdminNav from '../navigation/Navigationbar'
import styles from './WorkflowManager.module.css'; // Assuming you have a CSS module for styling
import WorkflowNode from './nodes/WorkflowNode';

export default function WorkflowManager() {
  return (
    <>
        <AdminNav/>
        <main className={styles.archivePage}>
            <h1>Workflow Manager</h1>
            <p>This is the Workflow Manager page.</p>
            <div>
              <WorkflowNode/>
            </div>
        </main>
    </>
  )
}
