create schema roadey;

set schema 'roadey';

--drop table roles cascade;
--drop table users cascade;
--drop table booking_statuses cascade; 
--drop table booking_types cascade;
--drop table bookings cascade;

create table roles (
	"role_id" serial primary key,
	"role" text
);
create table users (
	"user_id" serial primary key,
	"username" text not null unique,
	"password" text not null,
	"first_name" text not null,
	"last_name" text not null,
	"email" text not null,
	"role" int references roles ("role_id"), -- FK to roles table
	"image" text
);
create table booking_statuses (
	"status_id" serial primary key,
	"status" text not null unique
);
create table booking_types (
	"type_id" serial primary key,
	"type" text not null unique
);
create table bookings (
	"booking_id" serial primary key,
	"author" int not null references users ("user_id"),
	"venue" text not null,
	"payment" numeric(100,2) not null,
	"gig_date" timestamp not null,
	"date_submitted" timestamp not null,
	"date_resolved" timestamp, --not null,
	"description" text not null,
	"status" int references booking_statuses ("status_id") not null,  -- FK to booking_statuses table
	"type" int references booking_types ("type_id") -- FK to booking_types table
);

--------------------------------

set schema 'roadey';

insert into roles ("role")
	values ('Admin'),
		   ('User');

insert into users ("username", "password", "first_name", "last_name", "email", "role", "image")
	values ('Roadey', 'R04D3Y', 'Beckett', 'Finch', 'beckett.finch@roadey.com', 1, ''),
		   ('ParadiseLost', 'P4R4D153', 'Kylo', 'Otto', 'kylo.otto@paradiselost.com', 2, ''),
		   ('Seadog', '534D06', 'Jessa', 'Hart', 'jessa.hart@seadog.com', 2, ''),
		   ('GhostHost', '6H057H057', 'Zylan', 'Vade', 'zylan.vade@ghosthost.com', 2, ''),
		   ('TheKarmaProject', 'K4RM4', 'Deiter', 'Jeter', 'deiter.jeter@thekarmaproject.com', 2, ''),
		   ('AceofSpades', 'AC30F5P4D35', 'Ace', 'Alcott', 'ace.alcott@aceofspades.com', 2, ''),
		   ('ControlledChaos', 'CH405', 'Jebediah', 'Lawless', 'jebediah.lawless@controlledchaos.com', 2, ''),
		   ('TheoreticalNoise', 'N015E', 'Gage', 'Mackie', 'gage.mackie@theoreticalnoise.com', 2, ''),
		   ('PaperGiants', 'P4P3R614N75', 'Clive', 'Wilde', 'clive.wilde@papergiants.com', 2, ''),
		   ('FreeRadicals', 'FR33R4D1C4L5', 'Teague', 'Nox', 'teague.nox@freeradicals.com', 2, '');

insert into booking_statuses ("status")
	values ('Pending'),
		   ('Postponed'),
		   ('Cancelled'),
		   ('Booked');

insert into booking_types ("type")
	values ('Opening'),
		   ('Supporting'),
		   ('Headlining');

insert into bookings ("author", "venue", "payment", "gig_date", "date_submitted", "date_resolved", "description", "status", "type")
	values (2, 'First Avenue', 5000.00, '2021-01-11 10:30:00', '2020-01-24 02:30:00', '2020-01-24 02:40:00', 'Minneapolis, MN', 4, 1),
		   (1, '9:30 Club', 7000.00, '2021-02-14 09:30:00', '2020-01-30 03:00:00', '2020-01-30 03:36:00', 'Washington, DC', 1, 1),
		   (4, 'Tower Theater', 10000.00, '2021-03-17 08:30:00', '2020-02-15 04:20:00', '2020-02-15 04:40:00', 'Philadelphia, PA', 4, 2),
		   (3, 'Hollywood Bowl', 15000.00, '2021-04-19 09:30:00', '2020-02-02 05:16:00', '2020-02-02 05:56:00', 'Los Angeles, CA', 3, 2),
		   (8, 'Madison Square Garden', 18000.00, '2021-05-26 05:30:00', '2020-02-23 03:19:00', '2020-02-23 03:29:00', 'New York, NY', 2, 2),
		   (5, 'House of Blues', 17000.00, '2021-06-18 08:30:00', '2020-03-17 04:05:00', '2020-03-17 04:15:00', 'Dallas, TX', 1, 3),
		   (7, 'Red Rocks', 25000.00, '2021-07-04 06:30:00', '2020-04-06 06:30:00', '2020-04-06 06:45:00', 'Morrison, CO', 4, 3),
		   (6, 'Radio City Music Hall', 14000.00, '2021-08-10 07:30:00', '2020-05-10 01:02:00', '2020-05-10 01:24:00', 'New York, NY', 3, 2),
		   (10,'Jay Pritzker Pavillion', 12000.00, '2021-09-20 06:30:00', '2020-05-28 07:37:00', '2020-05-28 07:57:00', 'Chicago, IL', 2, 2),
		   (9,'The Fillmore', 20000.00, '2021-10-31 08:30:00', '2020-06-11 08:44:00', '2020-06-11 08:54:00', 'San Francisco, CA', 1, 3);

--Table contents
select * from bookings;
select * from booking_types;
select * from booking_statuses;
select * from roles;
select * from users;
