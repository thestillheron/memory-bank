CREATE TABLE [memory] (
  [id] varchar(36) PRIMARY KEY,
  [title] nvarchar NOT NULL,
  [content] nvarchar(max) NOT NULL,
  [significance] varchar NOT NULL,
  [year] varchar,
  [month] varchar,
  [day] varchar
)
GO

CREATE TABLE [tag] (
  [id] varchar(36) PRIMARY KEY,
  [name] nvarchar NOT NULL
)
GO

CREATE TABLE [person] (
  [id] varchar(36) PRIMARY KEY,
  [name] nvarchar NOT NULL
)
GO

CREATE TABLE [memoryPerson] (
  [personId] varchar(36),
  [memoryId] varchar(36),
  PRIMARY KEY ([personId], [memoryId])
)
GO

CREATE TABLE [memoryTag] (
  [memoryId] varchar(36),
  [tagId] varchar(36),
  PRIMARY KEY ([tagId], [memoryId])
)
GO

ALTER TABLE [memoryPerson] ADD FOREIGN KEY ([memoryId]) REFERENCES [memory] ([id])
GO

ALTER TABLE [memoryPerson] ADD FOREIGN KEY ([personId]) REFERENCES [person] ([id])
GO

ALTER TABLE [memoryTag] ADD FOREIGN KEY ([tagId]) REFERENCES [tag] ([id])
GO

ALTER TABLE [memoryTag] ADD FOREIGN KEY ([memoryId]) REFERENCES [memory] ([id])
GO