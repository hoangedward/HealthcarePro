import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default props => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="/static/semantic-ui-offline/semantic.min.css"
        />
        <title>Healthcare Pro</title>
      </Head>

      <Header />
      {props.children}
      <Footer />
    </Container>
  );
};
