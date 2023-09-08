/*
Copyright 2022 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import classNames from "classnames";
import { FC, HTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MatrixClient, RoomMember } from "matrix-js-sdk/src/matrix";
import { Heading } from "@vector-im/compound-web";

import styles from "./Header.module.css";
import { ReactComponent as Logo } from "./icons/Logo.svg";
import { Avatar, Size } from "./Avatar";
import { Facepile } from "./Facepile";
import { EncryptionLock } from "./room/EncryptionLock";
import { useMediaQuery } from "./useMediaQuery";

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
}

export function Header({ children, className, ...rest }: HeaderProps) {
  return (
    <header className={classNames(styles.header, className)} {...rest}>
      {children}
    </header>
  );
}

interface LeftNavProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  hideMobile?: boolean;
}

export function LeftNav({
  children,
  className,
  hideMobile,
  ...rest
}: LeftNavProps) {
  return (
    <div
      className={classNames(
        styles.nav,
        styles.leftNav,
        { [styles.hideMobile]: hideMobile },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface RightNavProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  hideMobile?: boolean;
}

export function RightNav({
  children,
  className,
  hideMobile,
  ...rest
}: RightNavProps) {
  return (
    <div
      className={classNames(
        styles.nav,
        styles.rightNav,
        { [styles.hideMobile]: hideMobile },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

interface HeaderLogoProps {
  className?: string;
}

export function HeaderLogo({ className }: HeaderLogoProps) {
  const { t } = useTranslation();

  return (
    <Link
      className={classNames(styles.headerLogo, className)}
      to="/"
      aria-label={t("Element Call Home")}
    >
      <Logo />
    </Link>
  );
}

interface RoomHeaderInfoProps {
  id: string;
  name: string;
  avatarUrl: string | null;
  encrypted: boolean;
  participants: RoomMember[];
  client: MatrixClient;
}

export const RoomHeaderInfo: FC<RoomHeaderInfoProps> = ({
  id,
  name,
  avatarUrl,
  encrypted,
  participants,
  client,
}) => {
  const { t } = useTranslation();
  const size = useMediaQuery("(max-width: 550px)") ? "sm" : "lg";

  return (
    <div className={styles.roomHeaderInfo} data-size={size}>
      <Avatar
        className={styles.roomAvatar}
        id={id}
        name={name}
        size={size === "sm" ? Size.SM : 56}
        src={avatarUrl ?? undefined}
      />
      <div className={styles.nameLine}>
        <Heading
          type={size === "sm" ? "body" : "heading"}
          size={size === "sm" ? "lg" : "md"}
          weight="semibold"
          data-testid="roomHeader_roomName"
        >
          {name}
        </Heading>
        <EncryptionLock encrypted={encrypted} />
      </div>
      {participants.length > 0 && (
        <div className={styles.participantsLine}>
          <Facepile client={client} members={participants} size={20} />
          {t("{{count, number}}", { count: participants.length })}
        </div>
      )}
    </div>
  );
};
