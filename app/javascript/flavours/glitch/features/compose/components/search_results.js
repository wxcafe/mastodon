import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import AccountContainer from 'flavours/glitch/containers/account_container';
import StatusContainer from 'flavours/glitch/containers/status_container';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Hashtag from 'flavours/glitch/components/hashtag';
import Icon from 'flavours/glitch/components/icon';

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
});

export default @injectIntl
class SearchResults extends ImmutablePureComponent {

  static propTypes = {
    results: ImmutablePropTypes.map.isRequired,
    suggestions: ImmutablePropTypes.list.isRequired,
    fetchSuggestions: PropTypes.func.isRequired,
    dismissSuggestion: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    this.props.fetchSuggestions();
  }

  render() {
    const { intl, results, suggestions, dismissSuggestion } = this.props;

    if (results.isEmpty() && !suggestions.isEmpty()) {
      return (
        <div className='drawer--results'>
          <div className='trends'>
            <div className='trends__header'>
              <i className='fa fa-user-plus fa-fw' />
              <FormattedMessage id='suggestions.header' defaultMessage='You might be interested in…' />
            </div>

            {suggestions && suggestions.map(accountId => (
              <AccountContainer
                key={accountId}
                id={accountId}
                actionIcon='times'
                actionTitle={intl.formatMessage(messages.dismissSuggestion)}
                onActionClick={dismissSuggestion}
              />
            ))}
          </div>
        </div>
      );
    }

    let accounts, statuses, hashtags;
    let count = 0;

    if (results.get('accounts') && results.get('accounts').size > 0) {
      count   += results.get('accounts').size;
      accounts = (
        <section>
          <h5><Icon icon='users' fixedWidth /><FormattedMessage id='search_results.accounts' defaultMessage='People' /></h5>

          {results.get('accounts').map(accountId => <AccountContainer id={accountId} key={accountId} />)}
        </section>
      );
    }

    if (results.get('statuses') && results.get('statuses').size > 0) {
      count   += results.get('statuses').size;
      statuses = (
        <section>
          <h5><Icon icon='quote-right' fixedWidth /><FormattedMessage id='search_results.statuses' defaultMessage='Toots' /></h5>

          {results.get('statuses').map(statusId => <StatusContainer id={statusId} key={statusId}/>)}
        </section>
      );
    }

    if (results.get('hashtags') && results.get('hashtags').size > 0) {
      count += results.get('hashtags').size;
      hashtags = (
        <section>
          <h5><Icon icon='hashtag' fixedWidth /><FormattedMessage id='search_results.hashtags' defaultMessage='Hashtags' /></h5>

          {results.get('hashtags').map(hashtag => <Hashtag key={hashtag.get('name')} hashtag={hashtag} />)}
        </section>
      );
    }

    //  The result.
    return (
      <div className='drawer--results'>
        <header className='search-results__header'>
          <Icon icon='search' fixedWidth />
          <FormattedMessage id='search_results.total' defaultMessage='{count, number} {count, plural, one {result} other {results}}' values={{ count }} />
        </header>

        {accounts}
        {statuses}
        {hashtags}
      </div>
    );
  };
}
