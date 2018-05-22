import React from 'react';
import PropTypes from 'prop-types';
import Base from '../../../components/modal_root';
import BundleContainer from '../containers/bundle_container';
import BundleModalError from './bundle_modal_error';
import ModalLoading from './modal_loading';
import ActionsModal from './actions_modal';
import MediaModal from './media_modal';
import VideoModal from './video_modal';
import BoostModal from './boost_modal';
import FavouriteModal from './favourite_modal';
import DoodleModal from './doodle_modal';
import ConfirmationModal from './confirmation_modal';
import {
  OnboardingModal,
  MuteModal,
  ReportModal,
  SettingsModal,
  EmbedModal,
  ListEditor,
} from 'flavours/glitch/util/async-components';

const MODAL_COMPONENTS = {
  'MEDIA': () => Promise.resolve({ default: MediaModal }),
  'ONBOARDING': OnboardingModal,
  'VIDEO': () => Promise.resolve({ default: VideoModal }),
  'BOOST': () => Promise.resolve({ default: BoostModal }),
  'FAVOURITE': () => Promise.resolve({ default: FavouriteModal }),
  'DOODLE': () => Promise.resolve({ default: DoodleModal }),
  'CONFIRM': () => Promise.resolve({ default: ConfirmationModal }),
  'MUTE': MuteModal,
  'REPORT': ReportModal,
  'SETTINGS': SettingsModal,
  'ACTIONS': () => Promise.resolve({ default: ActionsModal }),
  'EMBED': EmbedModal,
  'LIST_EDITOR': ListEditor,
};

export default class ModalRoot extends React.PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  };

  renderLoading = modalId => () => {
    return ['MEDIA', 'VIDEO', 'BOOST', 'FAVOURITE', 'DOODLE', 'CONFIRM', 'ACTIONS'].indexOf(modalId) === -1 ? <ModalLoading /> : null;
  }

  renderError = (props) => {
    const { onClose } = this.props;

    return <BundleModalError {...props} onClose={onClose} />;
  }

  render () {
    const { type, props, onClose } = this.props;
    const visible = !!type;

    return (
      <Base onClose={onClose} noEsc={props ? props.noEsc : false}>
        {visible && (
          <BundleContainer fetchComponent={MODAL_COMPONENTS[type]} loading={this.renderLoading(type)} error={this.renderError} renderDelay={200}>
            {(SpecificComponent) => <SpecificComponent {...props} onClose={onClose} />}
          </BundleContainer>
        )}
      </Base>
    );
  }

}
