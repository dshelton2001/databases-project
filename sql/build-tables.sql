CREATE TABLE `database-project`.Users
(
	UID INT NOT NULL,
	Username VARCHAR(20) UNIQUE NOT NULL,
	Password VARCHAR(20) NOT NULL,
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
	EventID INT NOT NULL,
	Name VARCHAR(30),
	LocationName VARCHAR(30),
	Time TIME,
	Description VARCHAR(300),
	PRIMARY KEY (EventID),
	FOREIGN KEY (LocationName) REFERENCES Location(Name)
);

CREATE TABLE `database-project`.Comments
(
	CommentID INT NOT NULL,
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
	RSOID INT NOT NULL,
	Name VARCHAR(30),
	Description VARCHAR(300),
	PRIMARY KEY (RSOID)
);

CREATE TABLE `database-project`.RSOEvents
(
	EventID INT NOT NULL,
	FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

CREATE TABLE `database-project`.PrivateEvents
(
	EventID INT NOT NULL,
	AdminID INT,
	SuperAdminID INT,
	FOREIGN KEY (EventID) REFERENCES Events(EventID),
	FOREIGN KEY (AdminID) REFERENCES Admins(UID),
	FOREIGN KEY (SuperAdminID) REFERENCES SuperAdmins(UID)
);

CREATE TABLE `database-project`.PublicEvents
(
	EventID INT NOT NULL,
	FOREIGN KEY (EventID) REFERENCES Events(EventID)
);