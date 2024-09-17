'use client'

import { useContext, useState } from "react";
import styles from "./page.module.css";
import NoteGUI from "./components/NoteGUI";
import { Note } from "./models/note";
// import { AppContext } from "./context/AppProvider";

export default function Home() {
  // const { notes } = useContext(AppContext);
  // const activeNotes = notes.filter(note => !note.isArchived && !note.isTrash);

  const note = new Note('1', '', '', false, false);

  // const [textFieldValue, setTextFieldValue] = useState("qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283qwer1223173017390213091238091283091283");

  // const handleTextFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setTextFieldValue(e.target.value);
  // };

  // const handleFocus = () => {
  //   console.log('Text field focused');
  // };

  // const handleBlur = () => {
  //   console.log('Text field blurred');
  // };

  return (

    <div className={styles.page}>
      <NoteGUI note={note} mode={'create'} />
      {/* {activeNotes.length === 0 ? (
          <h3>Notes you add appear here</h3>
        ) : (
          activeNotes.map(note => (
            <>
              <div style={{ height: '1rem' }} key={note.id} />
              <NoteGUI note={note} mode={'read'} key={note.id} />
            </>
          ))
        )} */}
    </div>
  );
}