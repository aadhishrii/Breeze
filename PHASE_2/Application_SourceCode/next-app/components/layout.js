/** @jsxRuntime classic */
/** @jsx jsx */
import { useState, useEffect } from 'react';

import { jsx, css } from '@emotion/core';

import {
  AtlassianNavigation,
  Create,
  Help,
  PrimaryButton,
  PrimaryDropdownButton,
  ProductHome,
} from '@atlaskit/atlassian-navigation';
import Avatar from '@atlaskit/avatar';
import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import {
  Header,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  SideNavigation,
} from '@atlaskit/side-navigation';
import {
  Content,
  LeftSidebar,
  Main,
  PageLayout,
  TopNavigation,
} from '@atlaskit/page-layout';

import Tooltip from '@atlaskit/tooltip';

import Link from 'next/link';
import Image from 'next/image';

import eventIcon from '../public/images/eventIcon.png';
import itineraryIcon from '../public/images/itineraryIcon.png';
import appIcon from '../public/images/BreezeIcon.png';
import appLogo from '../public/images/ApplicationLogo.png';

import EventTag from './eventTag';

import { signIn, signOut, useSession } from 'next-auth/react';

import LoadingPage from '../components/loadingPage';

import { getUserItineraries, getUserEvents, getProfileData } from '../lib/util';

var pageTitle = "Default";

const eventItemContainerStyles = css({
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
});

const iconstyles = css({
  objectFit: 'fill',
});

const buttonStyles = css({
  margin: '18px',
});

function TopNavigationContents(props) {
  const { data: session } = useSession()
  
  return (
    <AtlassianNavigation
      label="site"
      primaryItems={[
        <Link href="/home">
          <PrimaryButton isHighlighted={props.pageTitle==="Home"}>Home</PrimaryButton>
        </Link>,
        <Link href="/calendar">
          <PrimaryButton isHighlighted={props.pageTitle==="Calendar"}>Calendar</PrimaryButton>
        </Link>,
        <RecentPopup session={session}/>,
      ]}
      renderProductHome={ProductHomeExample}
      renderCreate={DefaultCreate}
      renderProfile={session ? DefaultProfile : null}
      renderSignIn={session ? DefaultSignOut : DefaultSignIn}
      renderHelp={HelpPopup}
    />
      
  );
}

const SideNavigationContent = () => {
  return (
    <SideNavigation label="Project navigation" testId="side-navigation">
      <NavigationHeader>
        <Header description="Sidebar header description">Sidebar Header</Header>
      </NavigationHeader>
      <NestableNavigationContent initialStack={[]}>
        <Section>
          <NestingItem id="1" title="Nested Item">
            <Section title="Group 1">
              <ButtonItem>Item 1</ButtonItem>
              <ButtonItem>Item 2</ButtonItem>
            </Section>
          </NestingItem>
        </Section>
      </NestableNavigationContent>
    </SideNavigation>
  );
};

/*
 * Components for composing top and side navigation
 */

export const DefaultSignIn = () => (
  <Button 
    css={ buttonStyles } 
    onClick={signIn}
  >
    Sign In
  </Button>
)

export const DefaultSignOut = () => (
  <Button 
    css={ buttonStyles } 
    onClick={signOut}
  >
    Sign Out
  </Button>
)


export const DefaultCreate = () => (
  <Link href="/event/creator">
    <Create
      appearance="default"
      buttonTooltip="Create Event"
      iconButtonTooltip="Create"
      onClick={() => {}}
      text="Create event"
    />
  </Link>
);

const DefaultProfile = () => {
  const { data: session } = useSession()
  return (
    <Tooltip content="Your Account">
      <Link href="/account/details">
        <Avatar src={session.user.image}/>
      </Link>
    </Tooltip>
  )
}

export const RecentPopup = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const [eventData, setEventData] = useState([]);
  const [itineraryData, setItineraryData] = useState([]);

  useEffect(async () => {
      if (props.session) {
          const user = await getProfileData(props.session.user.email);
          setEventData(await getUserEvents(user.id));
          setItineraryData(await getUserItineraries(user.id));
      }
    },[props.session]);

  return (
    <Popup
    content={() => RecentPopupContent(eventData, itineraryData)}
    isOpen={isOpen}
    placement="bottom-start"
    onClose={onClose}
    trigger={(triggerProps) => (
      <PrimaryDropdownButton
        {...triggerProps}
        isSelected={isOpen}
        onClick={onClick}
      >
        Recent
      </PrimaryDropdownButton>
    )}
    />
  );
};


export const ItineraryItem = (props) => {
  return (
    <Link href={`/itinerary/${props.id}`}>
      <ButtonItem iconBefore={<Image src={itineraryIcon}/>}>
        <div css={eventItemContainerStyles}>
          <p style={{}}>{props.title}</p>
          <p style={{color: '#6B778C'}}>{props.date} | {props.location}</p>
        </div>
      </ButtonItem>
    </Link>
  )
};

const EventItem = (props) => {
  return (
    <Link href={`/event/${props.id}`}>
      <ButtonItem iconBefore={<Image src={eventIcon}/>}>
        <div css={eventItemContainerStyles}>
          <p style={{}}>{props.title}</p>
          <p style={{color: '#6B778C'}}>{props.date} | {props.location}</p>
          {EventTag(props.risk)}
        </div>
      </ButtonItem>
    </Link>
  )
};

const RecentPopupContent = (eventData, itineraryData) => (
  <MenuGroup>
    <Section title={'Itineraries'}>
      {itineraryData && itineraryData.map((itinerary) => {
        const date = `${itinerary.startDate} - ${itinerary.endDate}` 
        return <ItineraryItem id={itinerary.id} title={itinerary.title} date={date} location={itinerary.destination}/>
      })}
    </Section>
    <Section title="Events" hasSeparator>
      {eventData && eventData.map((event) => (
        <EventItem id={event.id} title={event.title} date={event.date} location={event.location} risk={event.risk}/>
      ))}
    </Section>
  </MenuGroup>
);

const productIcon = () => (
  <Image src={appIcon} objectFit="contain"/>
);

const productLogo = () => (
  <Image src={appLogo} objectFit="contain"/>
);

const ProductHomeExample = () => (
    <ProductHome
      css={iconstyles}
      href="/home"
      icon={productIcon}
      logo={productLogo}
      siteTitle={pageTitle}
    />
);

export const HelpPopup = () => {
  return (
    <Help
      href="/"
      tooltip="About"
    />
  );
};

const Layout = (props) => {
  const { data: session, status } = useSession({ required: props.signInRequired })

  useEffect(() => {
    console.log(session)
  }, [session]); //Add session state to the useEffect

  if (status == "loading") {
    return <LoadingPage/>
  }

  if (props.pageTitle) {pageTitle = props.pageTitle;}
  return (
    <PageLayout>
      <TopNavigation
        isFixed={true}
        id="confluence-navigation"
        skipLinkTitle="Confluence Navigation"
      >
        <TopNavigationContents pageTitle={props.pageTitle}/>
      </TopNavigation>
      <Content testId="content">
        {/* <LeftSidebar
          isFixed={true}
          width={450}
          id="project-navigation"
          skipLinkTitle="Project Navigation"
          testId="left-sidebar"
        >
          <SideNavigationContent />
        </LeftSidebar> */}
        <Main id="main-content" skipLinkTitle="Main Content">
          {status === "loading" ? <LoadingPage/> : props.children}
        </Main>
      </Content>
    </PageLayout>
  );
}

export default Layout;