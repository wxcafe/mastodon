import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import LoadingIndicator from 'flavours/glitch/components/loading_indicator';
import {
  fetchAccount,
  fetchFollowers,
  expandFollowers,
} from 'flavours/glitch/actions/accounts';
import { FormattedMessage } from 'react-intl';
import AccountContainer from 'flavours/glitch/containers/account_container';
import Column from 'flavours/glitch/features/ui/components/column';
import ProfileColumnHeader from 'flavours/glitch/features/account/components/profile_column_header';
import HeaderContainer from 'flavours/glitch/features/account_timeline/containers/header_container';
import ImmutablePureComponent from 'react-immutable-pure-component';
import MissingIndicator from 'flavours/glitch/components/missing_indicator';
import ScrollableList from 'flavours/glitch/components/scrollable_list';

const mapStateToProps = (state, props) => ({
  isAccount: !!state.getIn(['accounts', props.params.accountId]),
  accountIds: state.getIn(['user_lists', 'followers', props.params.accountId, 'items']),
  hasMore: !!state.getIn(['user_lists', 'followers', props.params.accountId, 'next']),
  isLoading: state.getIn(['user_lists', 'followers', props.params.accountId, 'isLoading'], true),
});

export default @connect(mapStateToProps)
class Followers extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    isAccount: PropTypes.bool,
    multiColumn: PropTypes.bool,
  };

  componentWillMount () {
    if (!this.props.accountIds) {
      this.props.dispatch(fetchAccount(this.props.params.accountId));
      this.props.dispatch(fetchFollowers(this.props.params.accountId));
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.accountId !== this.props.params.accountId && nextProps.params.accountId) {
      this.props.dispatch(fetchAccount(nextProps.params.accountId));
      this.props.dispatch(fetchFollowers(nextProps.params.accountId));
    }
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandFollowers(this.props.params.accountId));
  }, 300, { leading: true });

  setRef = c => {
    this.column = c;
  }

  render () {
    const { accountIds, hasMore, isAccount, multiColumn, isLoading } = this.props;

    if (!isAccount) {
      return (
        <Column>
          <MissingIndicator />
        </Column>
      );
    }

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='account.followers.empty' defaultMessage='No one follows this user yet.' />;

    return (
      <Column ref={this.setRef}>
        <ProfileColumnHeader onClick={this.handleHeaderClick} multiColumn={multiColumn} />

        <ScrollableList
          scrollKey='followers'
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          prepend={<HeaderContainer accountId={this.props.params.accountId} hideTabs />}
          alwaysPrepend
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>
      </Column>
    );
  }

}
