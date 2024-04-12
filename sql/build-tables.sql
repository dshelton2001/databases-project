CREATE TABLE `database-project`.Users
(
	UID INT NOT NULL AUTO_INCREMENT,
	Username VARCHAR(20) UNIQUE NOT NULL,
	Password VARCHAR(20) NOT NULL,
	FirstName VARCHAR(20),
	LastName VARCHAR(20),
	PRIMARY KEY (UID)
);

CREATE TABLE `database-project`.Admins
(
	UID INT NOT NULL,
	FOREIGN KEY (UID) REFERENCES Users(UID)
);

CREATE TABLE `database-project`.SuperAdmins
(
	UID INT NOT NULL,
	FOREIGN KEY (UID) REFERENCES Admins(UID)
);


CREATE TABLE `database-project`.Location
(
	Name VARCHAR(30) NOT NULL,
	Address VARCHAR(90),
	Longitude DECIMAL,
	Latitude DECIMAL
);

CREATE TABLE `database-project`.Events
(
	EventID INT NOT NULL AUTO_INCREMENT,
	Name VARCHAR(30),
	LocationName VARCHAR(30),
	Time TIME,
	Description VARCHAR(300),
	PRIMARY KEY (EventID),
	FOREIGN KEY (LocationName) REFERENCES Location(Name)
);

CREATE TABLE `database-project`.Comments
(
	CommentID INT NOT NULL AUTO_INCREMENT,
	EventID INT NOT NULL,
	UID INT NOT NULL,
	Time TIME,
	Comment VARCHAR(300),
	PRIMARY KEY (CommentID),
	FOREIGN KEY (EventID) REFERENCES Events(EventID),
	FOREIGN KEY (UID) REFERENCES Users(UID)
);

CREATE TABLE `database-project`.RSOs
(
	RSOID INT NOT NULL AUTO_INCREMENT,
	Name VARCHAR(30) NOT NULL,
	Description VARCHAR(300),
	PRIMARY KEY (RSOID)
);

CREATE TABLE `database-project`.RSOEvents
(
	EventID INT NOT NULL,
	RSOID INT NOT NULL,
	FOREIGN KEY (EventID) REFERENCES Events(EventID),
	FOREIGN KEY (RSOID) REFERENCES RSOs(RSOID)
);

CREATE TABLE `database-project`.PrivateEvents
(
	EventID INT NOT NULL,
	FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

CREATE TABLE `database-project`.PublicEvents
(
	EventID INT NOT NULL,
	FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

CREATE TABLE `database-project`.RSOCreationHistory
(
	RSOID INT NOT NULL,
	UID INT NOT NULL,
	FOREIGN KEY (RSOID) REFERENCES Events(RSO),
	FOREIGN KEY (UID) REFERENCES Admins(UID)
);

CREATE TABLE `database-project`.RSOMembers
(
	RSOID INT NOT NULL,
	UID INT NOT NULL,
	FOREIGN KEY (RSOID) REFERENCES Events(RSO),
	FOREIGN KEY (UID) REFERENCES Users(UID)
);

CREATE TABLE `database-project`.EventCreationHistory
(
	EventID INT NOT NULL,
	UID INT NOT NULL,
	FOREIGN KEY (EventID) REFERENCES Events(EventID),
	FOREIGN KEY (UID) REFERENCES Admins(UID)
);

