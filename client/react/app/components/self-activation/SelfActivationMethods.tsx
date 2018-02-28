import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import METHODS from './methods';

const SelfActivation = () => {
  return (
    <table className='dashboard-list-table self-activation-table'>
      <thead>
        <tr>
          <th>Target Symptoms</th>
          <th>Self-Activation Technique</th>
          <th>Purpose of Method</th>
        </tr>
      </thead>
      <tbody>
        {
          METHODS.map((method, key) => {
            const { symptoms, technique, purpose } = method;

            return (
              <tr key={key}
                className='dashboard-list-row'>
                <td>{symptoms}</td>
                <td className='text-active'>{technique}</td>
                <td>{purpose}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

const TripleColumnTechnique = () => {
  const rows = [
    {
      thought: 'I never do anything right.',
      distortion: 'Overgeneralization.',
      response: 'Not true! I do a lot of things right.'
    },
    {
      thought: 'I\'m always late.',
      distortion: 'Overgeneralization.',
      response: 'I\'m not always late. I\'ve been on time plenty of times. If I\'m late more often than I\'d like, I\'ll work on this problem and develop a method to overcome it.'
    },
    {
      thought: 'Everyone will look down on me.',
      distortion: 'Mind reading. Overgeneralization. All-or-nothing thinking. Fortune teller error.',
      response: 'Someone may be disappointed, but it\'s not the end of the world.'
    },
    {
      thought: 'This shows what a jerk I am.',
      distortion: 'Labeling.',
      response: 'Come on, now. I\'m not "a jerk."'
    },
    {
      thought: 'I\'ll make a fool of myself.',
      distortion: 'Labeling. Fortune teller error.',
      response: 'I\'m not "a fool" either.I may appear foolish sometimes, but that doesn\'t make me a fool. Everyone makes mistakes sometimes.'
    }
  ];

  return (
    <div>
      <h1>Triple Column Technique</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th>Automatic Thought</th>
            <th>Cognitive Distortion</th>
            <th>Rational Response</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { thought, distortion, response } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td>{thought}</td>
                  <td>{distortion}</td>
                  <td>{response}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const AntiProcrastinationSheet = () => {
  const rows = [
    {
      activity: 'Outline the paper.',
      predictedDifficulty: 90,
      predictedSatisfaction: 10,
      actualDifficulty: 10,
      actualSatisfaction: 60
    },
    {
      activity: 'Write a rough draft.',
      predictedDifficulty: 90,
      predictedSatisfaction: 10,
      actualDifficulty: 15,
      actualSatisfaction: 75
    },
    {
      activity: 'Write the final draft.',
      predictedDifficulty: 75,
      predictedSatisfaction: 10,
      actualDifficulty: 10,
      actualSatisfaction: 80
    },
    {
      activity: 'Review and send the paper.',
      predictedDifficulty: 50,
      predictedSatisfaction: 15,
      actualDifficulty: 0,
      actualSatisfaction: 95
    }
  ];

  const styles = {
    activity: { width: '28%' },
    cell: { width: '18%' }
  };

  return (
    <div>
      <h1>Anti-Procrastination Sheet</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.activity}>Activity</th>
            <th style={styles.cell}>Predicted Difficulty</th>
            <th style={styles.cell}>Predicted Satisfaction</th>
            <th style={styles.cell}>Actual Difficulty</th>
            <th style={styles.cell}>Actual Satisfaction</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const {
                activity,
                predictedDifficulty,
                predictedSatisfaction,
                actualDifficulty,
                actualSatisfaction
              } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.activity}>{activity}</td>
                  <td style={styles.cell}>{predictedDifficulty}%</td>
                  <td style={styles.cell}>{predictedSatisfaction}%</td>
                  <td style={styles.cell}>{actualDifficulty}%</td>
                  <td style={styles.cell}>{actualSatisfaction}%</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const PleasurePredicting = () => {
  const rows = [
    {
      activity: 'Reading',
      withWhom: 'Self',
      predictedSatisfaction: 40,
      actualSatisfaction: 60
    },
    {
      activity: 'Dinner with Rob',
      withWhom: 'Rob',
      predictedSatisfaction: 70,
      actualSatisfaction: 80
    },
    {
      activity: 'Art Museum',
      withWhom: 'Self',
      predictedSatisfaction: 50,
      actualSatisfaction: 80
    },
    {
      activity: 'Susan\'s Party',
      withWhom: 'Susan and friends',
      predictedSatisfaction: 80,
      actualSatisfaction: 60
    },
    {
      activity: 'Jogging',
      withWhom: 'Self',
      predictedSatisfaction: 60,
      actualSatisfaction: 70
    }
  ];

  const styles = {
    cell: { width: '25%' }
  };

  return (
    <div>
      <h1>Pleasure Predicting Sheet</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Activity</th>
            <th style={styles.cell}>With Whom?</th>
            <th style={styles.cell}>Predicted Satisfaction</th>
            <th style={styles.cell}>Actual Satisfaction</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const {
                activity,
                withWhom,
                predictedSatisfaction,
                actualSatisfaction
              } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{activity}</td>
                  <td style={styles.cell}>{withWhom}</td>
                  <td style={styles.cell}>{predictedSatisfaction}%</td>
                  <td style={styles.cell}>{actualSatisfaction}%</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const ButRebuttal = () => {
  const rows = [
    {
      column: 'I really should finish that task, but I\'m just not in the mood.',
      rebuttal: 'I\'ll feel more like it once get started.When I\'m done I\'ll feel terrific.'
    },
    {
      column: 'But there\'s so much to do, it would take forever.',
      rebuttal: 'It won\'t take as long as I expect.I can always just do a part of it now.'
    },
    {
      column: 'But I\'m too tired.',
      rebuttal: 'So just do some of it and then take a rest.'
    },
    {
      column: 'I\'d rather rest now and watch TV.',
      rebuttal: 'I can, but I won\'t feel very good about it knowing this task is hanging over my head.'
    },
    {
      column: 'But I\'m just too lazy to do it today.',
      rebuttal: 'That can\'t be true, I\'ve done things like this many times in the past.'
    }
  ];

  const styles = {
    cell: { width: '50%' }
  };

  return (
    <div>
      <h1>The But-Rebuttal Method</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>But Column</th>
            <th style={styles.cell}>But Rebuttal</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { column, rebuttal } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{column}</td>
                  <td style={styles.cell}>{rebuttal}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const SelfEndorsement = () => {
  const rows = [
    {
      selfDowning: 'Anybody could clean these dishes.',
      selfEndorsing: 'If it\'s a routine, boring chore, I deserve extra credit for doing it.'
    },
    {
      selfDowning: 'There\'s no point in cleaning them.They will just get dirty again.',
      selfEndorsing: 'That\'s the point. They\'ll be clean when I need them.'
    },
    {
      selfDowning: 'I could\'ve done a better job fixing up my room.',
      selfEndorsing: 'Nothing is perfect, but I did make the room look a lot better!'
    },
    {
      selfDowning: 'It was just luck that my speech was successful.',
      selfEndorsing: 'It wasn\'t a matter of luck.I prepared well and delivered my talk effectively.'
    },
    {
      selfDowning: 'I washed my car, but it still doesn\'t look as good as my friend\'s new car.',
      selfEndorsing: 'The car looks much better than it did before, and I\'ll really enjoy driving it around.'
    }
  ];

  const styles = {
    cell: { width: '50%' }
  };

  return (
    <div>
      <h1>The Self-Endorsement Technique</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Self-Downing Statement</th>
            <th style={styles.cell}>Self-Endorsing Statement</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { selfDowning, selfEndorsing } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{selfDowning}</td>
                  <td style={styles.cell}>{selfEndorsing}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const TicTocTechnique = () => {
  const rows = [
    {
      tic: 'I\'ll never be able to clean out the garage.',
      toc: 'Overgeneralization; all-or-nothing thinking. Just do a little bit and get started. There\'s no reason to do it all today.'
    },
    {
      tic: 'My work isn\'t very important or exciting.',
      toc: 'Disqualifying the positive. It may seem routine to me, but it\'s quite important to the people I work with.I get to be creative, and sometimes it can be very enjoyable.Maybe I could do something more exciting in my free time?'
    },
    {
      tic: 'Writing this paper is pointless.',
      toc: 'All-or-nothing thinking. It doesn\'t have to be a masterpiece.I might learn something, and it\'ll feel good to get it done.'
    },
    {
      tic: 'If I lose this deal, I\'ll be a laughing stock.',
      toc: 'Fortune-teller error; labeling. It\'s not shameful to lose a deal. A lot of people respect me and my work.'
    },
    {
      tic: 'If I talk to that girl, she\'ll reject me. What\'s the point?',
      toc: 'Fortune-teller error; overgeneralization. They can\'t all turn me down, and it\'s not shameful to try. I can learn from rejection. I\'ve got to practice to improve.'
    },
    {
      tic: 'This work has to be great, but I\'m not feeling very creative or motivated.',
      toc: 'All-or-nothing thinking. Just prepare an adequate draft. I can improve it later.'
    }
  ];

  const styles = {
    cell: { width: '50%' }
  };

  return (
    <div>
      <h1>The TIC-TOC Technique</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Task-Interfering Cognitions (TIC)</th>
            <th style={styles.cell}>Task-Oriented Cognitions (TOC)</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { tic, toc } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{tic}</td>
                  <td style={styles.cell}>{toc}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const MotivationWithoutCoercion = () => {
  const activity = 'Lying in Bed';
  const rows = [
    {
      advantage: 'It\'s easy.',
      disadvantage: 'While it seems easy, it gets awfully boring and painful after a while. It\'s actually not so easy to do nothing and just lie here moping and criticizing myself for hours.'
    },
    {
      advantage: 'I won\'t have to do anything of face my problems.',
      disadvantage: 'I won\'t be obliged to do anything if I get out of bed either, but it might make me feel better. If I avoid my problems, they won\'t go away, they\'ll just keep getting worse. I won\'t have the satisfaction of trying to solve them. The short-term discomfort of facing up to things is probably less depressing than the endless anguish of staying in bed.'
    },
    {
      advantage: 'I can sleep and escape.',
      disadvantage: 'and escape.	I can\'t sleep forever, and I really don\'t need any more sleep since I have been sleeping nearly 16 hours a day. I will probably feel less fatigued if I get up and get my body moving.'
    }
  ];

  const styles = {
    cell: { width: '50%' }
  };

  return (
    <div>
      <h1>Motivation Without Coercion</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Advantages of {activity}</th>
            <th style={styles.cell}>Disadvantages of {activity}</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { advantage, disadvantage } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{advantage}</td>
                  <td style={styles.cell}>{disadvantage}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const CannotLoseSystem = () => {
  const activity = 'Being Rejected';
  const rows = [
    {
      negativeConsequence: 'This means I\'ll never get a job.',
      copingStrategy: 'Overgeneralization. This is unlikely. I can test this by applying for a series of other jobs and putting my best foot forward.'
    },
    {
      negativeConsequence: 'My friends will look down on me.',
      copingStrategy: 'Fortune-teller error. Maybe they will be sympathetic.'
    },
    {
      negativeConsequence: 'If they\'re not sympathetic, they might say this shows I don\'t have what it takes.',
      copingStrategy: 'Point out that I\'m doing my best and that negative attitude doesn\'t help.'
    },
    {
      negativeConsequence: 'But I\'m nearly broke, and I need the money.',
      copingStrategy: 'I\'ve survived so far. I have friends and family that are there for me if I really need them.'
    },
    {
      negativeConsequence: 'A lot of my friends have jobs. They\'ll see I can\'t handle the business world.',
      copingStrategy: 'They\'re not all employed, and even the ones that do have jobs can probably remember a time when they were struggling to find work.'
    }
  ];

  const styles = {
    cell: { width: '50%' }
  };

  return (
    <div>
      <h1>The "Can't Lose" System</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Negative Consequences of {activity}</th>
            <th style={styles.cell}>Positive Thoughts and Coping Strategies</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { negativeConsequence, copingStrategy } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{negativeConsequence}</td>
                  <td style={styles.cell}>{copingStrategy}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

const VisualizeSuccess = () => {
  const rows = [
    {
      activity: 'Exercising regularly',
      consequences: [
        'I\'ll improve my health.',
        'I\'ll have more stamina and energy.',
        'I\'ll live longer.'
      ]
    },
    {
      activity: 'Reading various types of literature',
      consequences: [
        'I\'ll learn more.',
        'It\'s a good mental workout.',
        'It will improve my ability to communicate and empathize.'
      ]
    },
    {
      activity: 'Writing essays',
      consequences: [
        'It will give me clarity of thought.',
        'It will help me become more articulate.',
        'It will lead to new ideas.'
      ]
    },
  ];

  const styles = {
    activity: { width: '40%' },
    consequences: { width: '60%' },
    text: { marginBottom: 8 }
  };

  return (
    <div>
      <h1>Visualize Success</h1>

      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.activity}>Activity</th>
            <th style={styles.consequences}>Positive Consequences</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { activity, consequences } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.activity}>{activity}</td>
                  <td style={styles.consequences}>
                    {
                      consequences.map((text, k) => {
                        return (
                          <div key={k} style={styles.text}>
                            {text}
                          </div>
                        );
                      })
                    }
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

class SelfActivationMethods extends React.Component<RouteComponentProps<{}>> {
  render() {
    const { history } = this.props;

    return (
      <div>
        <NavBar
          title='Self-Activation Methods'
          linkTo='/'
          history={history} />

        <div className='default-container'>
          <SelfActivation />

          <TripleColumnTechnique />

          <AntiProcrastinationSheet />

          <PleasurePredicting />

          <ButRebuttal />

          <SelfEndorsement />

          <TicTocTechnique />

          <MotivationWithoutCoercion />

          <CannotLoseSystem />

          <VisualizeSuccess />
        </div>
      </div>
    );
  }
}

export default SelfActivationMethods;
