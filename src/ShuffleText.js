import React from 'react';
import './ShuffleText.css'; // Assuming you have a CSS file for styling

const ShuffleText = ({ style }) => {
  return (
    <div className="shuffle-text-container" style={style}>
      <div className="shuffle-text" style={{ transform: 'rotateY(30deg)' }}>
        <h2 style={{ color: '#FF0000', fontSize: '2.5rem', marginBottom: '20px' }}>
          HOW CAN ARCHIVES BE MADE MORE PARTICIPATORY?
        </h2>
        <p>
          Since institutional archives not only take special care to maintain their collection structures, but also endeavor to preserve materials and maintain their preservation in order to protect the actual sources and keep them alive in a certain way, certain hurdles become clear with regard to the accessibility of archives and the archival records stored in them, some of which are hidden.
        </p>
        <p>
          Against this backdrop, the digital space opens up new possibilities for accessibility. In addition to browsing, stumbling across and drifting through the collection of digital testimonies, users are given the opportunity to archive digital traces themselves. This participatory form rethinks accessibility: users are given a creative function in the archiving process.
        </p>
        <p>
          In this way, the character of an archive below becomes clear. The users become part of a new collectivization process of memories. If we consider memory as a resource, we could say that collectivization processes aim to use this resource in such a way that it is accessible to the entirety of the group.
        </p>
        <p>
          In this sense, collectivizing memory means ensuring that certain memories are not lost, but are available to the community as a whole and remain anchored as part of a collective memory. Just as queer and feminist emancipation movements have done by collecting their own pamphlets, protocols, posters, and personal legacies such as photos and diaries, thus keeping the upper hand on how their stories can be told and passed on as knowledge to others, the online archive HIV/AIDS Legacy also generates itself through the desire of self-responsibility and self-empowerment of memories, of history, of knowledge.
        </p>
      </div>
    </div>
  );
};

export default ShuffleText;
