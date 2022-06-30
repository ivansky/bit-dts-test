import React from 'react';
import styled from 'styled-components';
import { Modal } from '@dts-test/components.modal';

const GalleryThingy = styled.div(({ theme }) => theme.modals.commonModal);

function SomeGalleryThing() {
  return <Modal><GalleryThingy /></Modal>;
}

export { SomeGalleryThing };
