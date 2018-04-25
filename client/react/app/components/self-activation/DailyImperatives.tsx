import * as React from 'react';
import { extend, random, groupBy } from 'lodash';
import { resolve } from 'bluebird';
import { Link, RouteComponentProps } from 'react-router-dom';
import {
  Imperative,
  ImperativeType,
  fetchImperatives,
  createImperative,
  updateImperative,
  deleteImperative
} from '../../helpers/imperatives';
import NavBar from '../navbar';

interface ItemProps {
  item: Imperative;
  rank: number;
  onUpdate: (id: number, updates: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

interface ItemState {
  updatedItem: any;
  isEditing: boolean;
}

class ImperativeItem extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props);

    const { item } = props;

    this.state = {
      updatedItem: extend({}, item),
      isEditing: false
    };
  }

  componentDidUpdate(prevProps: ItemProps, prevState: ItemState) {
    const { isEditing } = this.state;
    const { isEditing: wasEditing } = prevState;

    if (!wasEditing && isEditing) {
      const el = (this.refs.editImperativeInput as HTMLInputElement);
      const val = el.value;

      el.focus();
      // Hack to move cursor to end of word
      el.value = '';
      el.value = val;
    }
  }

  updateItem(e: any) {
    const { name, value } = e.target;
    const { updatedItem } = this.state;

    return this.setState({
      updatedItem: extend(updatedItem, { [name]: value })
    });
  }

  save(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const { updatedItem } = this.state;
    const { onUpdate } = this.props;
    const { id, description } = updatedItem;

    if (!description) return resolve();

    return onUpdate(id, { description })
      .then(() => this.setState({ isEditing: false }));
  }

  handleCancel() {
    const { item } = this.props;

    return this.setState({
      updatedItem: extend({}, item),
      isEditing: false
    });
  }

  renderStaticItem() {
    const { item, rank, onDelete } = this.props;
    const { id: itemId, description } = item;

    return (
      <div className='task-item editable'
        style={{ paddingLeft: 16 }}>
        <img className='remove-icon pull-left'
          src='assets/plus-gray.svg'
          onClick={() => onDelete(itemId)} />
        <span className='number-label pull-left'>{rank}.</span>
        <span className='imperative-description'
          onClick={() => this.setState({ isEditing: true })}>
          {description}
        </span>
      </div>
    );
  }

  renderEditableItem() {
    const { updatedItem } = this.state;
    const { description, points } = updatedItem;

    return (
      <form onSubmit={this.save.bind(this)}>
        <input
          type='text'
          name='description'
          className='input-default -inline imperative-description-input'
          ref='editImperativeInput'
          placeholder='Task'
          value={description}
          onChange={this.updateItem.bind(this)}
          onBlur={this.save.bind(this)} />
      </form>
    );
  }

  render() {
    const { isEditing } = this.state;

    return (
      <li className='task-item-container'>
        {
          isEditing ?
            this.renderEditableItem() :
            this.renderStaticItem()
        }
      </li>
    );
  }
}

interface CategoryProps {
  type: string;
  items: Imperative[];
  handleCreateItem: (item: Imperative) => Promise<void>;
  handleUpdateItem: (itemId: number, updates: object) => Promise<void>;
  handleDeleteItem: (itemId: number) => Promise<void>;
}

interface CategoryState {
  isCreating: boolean;
  newImperative?: string;
}

class ImperativeCategory extends React.Component<CategoryProps, CategoryState> {
  constructor(props: CategoryProps) {
    super(props);

    this.state = {
      isCreating: false,
      newImperative: ''
    };
  }

  componentDidUpdate(prevProps: CategoryProps, prevState: CategoryState) {
    const { isCreating } = this.state;
    const { isCreating: wasCreating } = prevState;

    if (!wasCreating && isCreating) {
      const el = (this.refs.newImperativeInput as HTMLInputElement);

      el.focus();
    }
  }

  handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { newImperative: description } = this.state;
    const { type, items = [], handleCreateItem } = this.props;

    if (!description) {
      return this.setState({
        newImperative: '',
        isCreating: false
      });
    }

    return handleCreateItem({ description })
      .then(() => {
        return this.setState({
          newImperative: '',
          isCreating: false
        });
      });
  }

  renderNewItemForm() {
    const {
      isCreating,
      newImperative = ''
    } = this.state;

    return (
      <form
        className={isCreating ? '' : 'hidden'}
        onSubmit={(e) => this.handleCreate(e)}>
        <input
          type='text'
          className='input-default -inline imperative-description-input'
          ref='newImperativeInput'
          placeholder='New item...'
          value={newImperative}
          onChange={(e) => this.setState({ newImperative: e.target.value })}
          onBlur={this.handleCreate.bind(this)}/>
      </form>
    );
  }

  render() {
    const { isCreating } = this.state;
    const {
      type,
      handleDeleteItem,
      handleUpdateItem,
      items = []
    } = this.props;

    return (
      <div>
        <h4 className='category-label'
          style={{ marginLeft: 16 }}>
          {type}
          <img
            className={false ? 'hidden' : 'plus-icon'}
            src='assets/plus.svg'
            onClick={() => this.setState({ isCreating: true })} />
        </h4>
        <ul className='task-sublist'>
          {
            items
              .sort((x, y) => x.id - y.id)
              .map((item, index) => {
                const { id: itemId } = item;
                const key = itemId || index;

                return (
                  <ImperativeItem
                    key={key}
                    item={item}
                    rank={index + 1}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem} />
                );
              })
          }
          <li className='task-item-container'>
            {this.renderNewItemForm()}
          </li>
        </ul>
      </div>
    );
  }
}

interface ImperativeProps {}
interface ImperativeState {
  imperatives: Imperative[];
}

class DailyImperatives extends React.Component<
  RouteComponentProps<{}>,
  ImperativeState
> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      imperatives: []
    };
  }

  componentDidMount() {
    const { history } = this.props;

    return fetchImperatives()
      .then(imperatives => {
        return this.setState({ imperatives });
      })
      .catch(err => {
        // TODO: handle this at a higher level
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching dos and don\'ts!', err);
      });
  }

  handleCreateImperative(type: ImperativeType, params = {} as Imperative) {
    const { imperatives = [] } = this.state;
    const newImperative = extend(params, { type });

    return createImperative(newImperative)
      .then(imperative => {
        return this.setState({
          imperatives: imperatives.concat(imperative)
        });
      });
  }

  handleUpdateImperative(imperativeId: number, updates = {}) {
    const { imperatives = [] } = this.state;

    return updateImperative(imperativeId, updates)
      .then(updated => {
        return this.setState({
          imperatives: imperatives.map(imperative => {
            return imperative.id === imperativeId
              ? extend(imperative, updates)
              : imperative;
          })
        });
      });
  }

  handleDeleteImperative(imperativeId: number) {
    const { imperatives = [] } = this.state;

    return deleteImperative(imperativeId)
      .then(() => {
        return this.setState({
          imperatives: imperatives.filter(imperative => {
            return imperative.id !== imperativeId;
          })
        });
      });
  }

  render() {
    const { DO, DONT } = ImperativeType;
    const { imperatives } = this.state;
    const { DO: dos, DONT: donts } = groupBy(imperatives, 'type');
    const { history } = this.props;
    const style = { width: '50%', minWidth: 400, paddingRight: 24 };

    return (
      <div>
        <NavBar
          title={`Dos and Don'ts`}
          linkTo='/today'
          history={history} />

        <div className='default-container'>
          <div className='clearfix'>
            <div className='pull-left' style={style}>
              <ImperativeCategory
                type='Dos'
                items={dos}
                handleCreateItem={this.handleCreateImperative.bind(this, DO)}
                handleDeleteItem={this.handleDeleteImperative.bind(this)}
                handleUpdateItem={this.handleUpdateImperative.bind(this)} />
            </div>

            <div className='pull-left' style={style}>
              <ImperativeCategory
                type={`Don'ts`}
                items={donts}
                handleCreateItem={this.handleCreateImperative.bind(this, DONT)}
                handleDeleteItem={this.handleDeleteImperative.bind(this)}
                handleUpdateItem={this.handleUpdateImperative.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DailyImperatives;
