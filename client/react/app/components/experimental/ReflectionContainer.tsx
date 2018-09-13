import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  IAssessment,
  AssessmentType
} from '../../helpers/assessment';
import NavBar from '../navbar';
import './Reflect.less';

interface ReflectionProps extends RouteComponentProps<{}> {

}

interface ReflectionState {
  isLoading: boolean;
}

class Reflection extends React.Component<ReflectionProps, ReflectionState> {
  constructor(props: ReflectionProps) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    // TODO: get assessments
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      // TODO: handle loading state better
    }

    return (
      <div className='default-wrapper simple'>
        <div className='default-container simple'>
          <div className='reflections-container'>
            <div className='reflection-menu-item'>
              <div className='reflection-title'>Depression Assessment</div>
              <div>
                <div className='reflection-progress-container'>
                  <div className='reflection-progress-bar' style={{ width: '20%' }}>
                  </div>
                </div>
                {/* TODO: use real data */}
                <div className='reflection-action'>2 / 10 Questions</div>
              </div>
            </div>

            <div className='reflection-menu-item'>
              <div className='reflection-title'>Anxiety Assessment</div>
              <div>
                <div className='reflection-progress-container'>
                <div className='reflection-progress-bar' style={{ width: '70%' }}>
                  </div>
                </div>
                {/* TODO: use real data */}
                <div className='reflection-action'>7 / 10 Questions</div>
              </div>
            </div>

            <div className='reflection-menu-item'>
              <div className='reflection-title'>Well-Being Assessment</div>
              <div>
                <div className='reflection-progress-container'>
                <div className='reflection-progress-bar' style={{ width: '60%' }}>
                  </div>
                </div>
                {/* TODO: use real data */}
                <div className='reflection-action'>6 / 10 Questions</div>
              </div>
            </div>

            <div className='reflection-menu-item'>
              <div className='reflection-title'>Journal</div>
              <div className='reflection-action'>Write</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reflection;
