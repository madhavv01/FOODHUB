import React from 'react';

const Note = ({ note }) => {
  return (
    <div className="note">
      <p>{note.content}</p>
      <small>
        Posted on: {new Date(note.createdAt).toLocaleString()}
        {note.userName && ` by ${note.userName}`}
      </small>
    </div>
  );
};

export default Note;