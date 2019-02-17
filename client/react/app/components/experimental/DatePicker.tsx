import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import * as moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './Datepicker.less';

interface DatePickerProps {

}

interface DatePickerState {
  selected?: moment.Moment;
}

class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
  constructor(props: DatePickerProps) {
    super(props);

    this.state = {
      selected: moment()
    };
  }

  handleChange = (date: moment.Moment) => {
    return this.setState({ selected: date });
  }

  render() {
    const { selected } = this.state;

    return (
      <ReactDatePicker
        className='datepicker-wrapper'
        calendarClassName='calendar-datepicker-wrapper'
        selected={selected}
        onChange={this.handleChange} />
    );
  }
}

export default DatePicker;
