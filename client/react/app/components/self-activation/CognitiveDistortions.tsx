import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import md from '../../helpers/markdown';

const formatHTML = (content = '') => {
  return { __html: md(content) };
};

const content = `
### All-or-Nothing Thinking
You see things in black-and-white categories. If your performance falls short of perfect, you see yourself as a total failure.

### Overgeneralization
You see a single negative event as a never-ending pattern of defeat.

### Mental Filter
You pick out a single negative detail and dwell on it exclusively so that your vision of all reality becomes darkened, like the drop of ink that colors the entire beaker of water.

### Disqualifying the Positive
You reject positive experiences by insisting they "don't count" for some reason or other. In this way you can maintain a negative belief that is contradicted by your everyday experiences.

### Jumping to Conclusions
You make a negative interpretation even though there are no definite facts that convincingly support your conclusion.
- *Mind reading:* You arbitrarily conclude that someone is reacting negatively to you, and you don't bother to check this out.
- *The Fortune Teller Error:* You anticipate that things will turn out badly, and you feel convinced that your prediction is an already-established fact.

### Magnification (Catastrophizing) or Minimization
You exaggerate the importance of things (such as your goof-up or someone else's achievement), or you inappropriately shrink things until they appear tin (your own desirable qualities or the other fellow's imperfections). This is also called the "binocular trick."

### Emotional Reasoning
You assume that your negative emotions necessarily reflect the way things really are: "I feel it, therefore it must be true."

### "Should" Statements
You try to motivate yourself with shoulds and shouldn'ts, as if you had to be whipped and punished before you could be expected to do anything. "Musts" and "oughts" are also offenders. The emotional consequence is guilt. When you direct should statements toward others, you feel anger, frustration, and resentment.

### Labeling and Mislabeling
This is an extreme form of overgeneralization. Instead of describing your error, you attach a negative label to yourself: "I'm a loser." When someone else's behavior rubs you the wrong way, you attach a negative label to him or her: "He's a goddamn louse." Mislabeling involves describing an event with language that is highly colored and emotionally loaded.

### Personalization
You see yourself as the cause of some negative external event which in fact you were not primarily responsible for.
`;

class CognitiveDistortions extends React.Component<RouteComponentProps<{}>> {
  render() {
    const { history } = this.props;

    return (
      <div>
        <NavBar
          title='Cognitive Distortions'
          linkTo='/'
          history={history} />

        <div className='default-container'>
          <div className='md-content'
            dangerouslySetInnerHTML={formatHTML(content)}>
          </div>
        </div>
      </div>
    );
  }
}

export default CognitiveDistortions;
