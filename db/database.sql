-- created the database 
DROP DATABASE alumniDatabase;
CREATE DATABASE alumniDatabase;

-- use the database 
USE alumniDatabase;

CREATE TABLE users (
    id char(36) NOT NULL DEFAULT (UUID()),
    email varchar(50) NOT NULL UNIQUE,
    password varchar(100) NOT NULL,
    role set('admin', 'user', 'alumni') default 'user',     -- upon approval, role will be changed to alumni
    primary key(id)
);

CREATE TABLE profiles (
    userId char(36) NOT NULL,    
    title SET('mr', 'mrs', 'ms', 'dr') NOT NULL,
    firstName varchar(64) NOT NULL,
    lastName varchar(64),
    dob varchar(10) NOT NULL,
    sex SET('male', 'female', 'others') NOT NULL,
    category  varchar(10),
    nationality varchar(15) NOT NULL,
    religion varchar(16),
    address varchar(128) NOT NULL,
    pincode varchar(10) NOT NULL,
    state  varchar(64) NOT NULL,
    city varchar(64) NOT NULL,
    country  varchar(64) NOT NULL,

    phone varchar(15), 
    altPhone varchar(15),
    altEmail varchar(255),
    linkedin varchar(50),
    github varchar(50),

    registrationNo varchar(20) NOT NULL,
    rollNo varchar(16),

    sign  varchar(255) DEFAULT NULL,
    avatar varchar(255) DEFAULT NULL,

    PRIMARY KEY(userId),
    FOREIGN KEY(userId) REFERENCES users(id)
);

-- create table for storing academics details of users, having foreign key as userId from profile table
CREATE TABLE academics (
    id char(36) NOT NULL DEFAULT (UUID()),
    userId char(36) NOT NULL,
    type SET('part-time', 'full-time') DEFAULT 'full-time',
    institute varchar(255) NOT NULL,
    degree varchar(50) NOT NULL,
    discipline varchar(50) NOT NULL,    -- field of study
    startDate varchar(10) NOT NULL,
    endDate varchar(10) NOT NULL,       -- or exptected
    description varchar(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES profiles(userId)
);

-- create table for storing experience (job and internship) details of users having foreign key as userId from profile table
CREATE TABLE experiences (
    id char(36) NOT NULL DEFAULT (UUID()),
    userId char(36) NOT NULL,
    type SET('job', 'internship') DEFAULT 'job',
    organisation varchar(255) NOT NULL,
    designation varchar(255) NOT NULL,
    location varchar(255) NOT NULL,
    startDate varchar(10) NOT NULL,
    endDate varchar(10) DEFAULT 'present',
    ctc decimal(10,2),
    description varchar(255) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES profiles(userId)
);

CREATE TABLE membership_applications (
    userId char(36) NOT NULL,
    membershipLevel SET('level1_networking', 'level2_volunteering') NOT NULL,
    sign VARCHAR(255) NOT NULL,
    submitDate DATETIME DEFAULT NOW(),

    status SET('pending', 'approved', 'rejected') DEFAULT 'pending',
    PRIMARY KEY(userId),
    FOREIGN KEY(userId) REFERENCES profiles(userId)
);

CREATE TABLE organisationDetails 
(
    organisation  varchar(100) 
);