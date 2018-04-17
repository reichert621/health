import * as React from 'react';
import { IDropdownOption } from '../../helpers/utils';

interface DropdownProps {
  options: IDropdownOption[];
  selected: IDropdownOption;
  className?: string;
  onSelect: (option: any) => void;
}

interface DropdownState {
  isOpen: boolean;
}

// TODO: this could potentially be used in places other than the tasks UI
class Dropdown extends React.Component<DropdownProps, DropdownState> {
  handleClickOutside: (e: any) => void;

  constructor(props: DropdownProps) {
    super(props);

    this.handleClickOutside = this.onClickOutside.bind(this);
    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onClickOutside(e: any) {
    const { isOpen } = this.state;
    const el = (this.refs.dropdownMenu as HTMLElement);
    const isClickedOutside = !el.contains(e.target);

    if (isOpen && isClickedOutside) {
      this.setState({ isOpen: false });
    }
  }

  handleOptionSelected(option: any) {
    this.props.onSelect(option);

    return this.setState({
      isOpen: false
    });
  }

  render() {
    const { isOpen } = this.state;
    const { onSelect, options, selected, className = '' } = this.props;

    return (
      <div
        className={`dropdown ${isOpen ? 'open' : ''} ${className}`}
        ref='dropdownMenu'>
        <div
          className='dropdown-toggle'
          onClick={() => this.setState({ isOpen: !isOpen })}>
          {selected ? selected.value : 'Select'}
        </div>
        <div className='dropdown-menu'>
          {
            options.map((option, key) => {
              const { value, subvalue } = option;

              return (
                <div key={key}
                  className={`dropdown-item ${subvalue ? '-subtext' : ''}`}
                  onClick={() => this.handleOptionSelected(option)}>
                  <div>{value}</div>
                  {
                    subvalue &&
                    <div className='dropdown-subtext'>
                      {subvalue}
                    </div>
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default Dropdown;
