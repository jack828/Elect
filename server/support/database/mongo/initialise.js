/* global db, ObjectId, ISODate */

db.dropDatabase()

db.getCollection('administrator').ensureIndex({
  firstName: 'text',
  lastName: 'text',
  emailAddress: 'text'
})

db.getCollection('vote').ensureIndex({
  election: 1,
  user: 1
})

db.getCollection('user').ensureIndex({
  emailAddress: 1
})

db.getCollection('administrator').insertOne({
  _id: ObjectId('5b72d5deb65c9040e6d0f62a'),
  firstName: 'Jack',
  lastName: 'Burgess',
  emailAddress: 'admin@elect.dev',
  password: '$2a$10$HszGIf5q2.k1k1cZOb.rZOrdk.xli4MbUmSCsCZYY0D5QJTDiu6bu',
  passwordSalt: 'afbb96ae65e809c68abe138d0e2b7333d1684856',
  key: 'b0bf99d9f04017a1ec2a07bad6cb2b29181b52ee',
  keyExpiry: null,
  enabled: true,
  failedLoginAttempts: 0,
  nextAllowedLoginAttemptDate: null,
  createdDate: ISODate('2018-08-14T13:15:10.476Z')
})

db.getCollection('election').insertOne({
  _id: ObjectId('5c5df895fde2504c5eaa2301'),
  name: 'General Election 2019',
  parties: [
    '5cbb56e08832730876626d12',
    '5cbb57058832730876626d13',
    '5cbb582e8832730876626d16',
    '5cbb57d78832730876626d14',
    '5cbb57eb8832730876626d15'
  ],
  visibleFrom: ISODate('2019-02-05T00:00:00.000Z'),
  visibleTo: ISODate('2019-05-16T23:00:00.000Z'),
  voteOpenFrom: ISODate('2019-02-07T00:00:00.000Z'),
  voteOpenTo: ISODate('2019-05-14T23:00:00.000Z'),
  createdDate: ISODate('2019-02-08T21:45:57.336Z')
})
db.getCollection('party').insertMany([
  {
    _id: ObjectId('5cbb56e08832730876626d12'),
    name: 'Conservative',
    enabled: true,
    createdDate: ISODate('2019-04-20T17:29:04.743Z'),
    colour: '#0087dc'
  },
  {
    _id: ObjectId('5cbb57058832730876626d13'),
    name: 'Labour',
    enabled: true,
    createdDate: ISODate('2019-04-20T17:33:32.664Z'),
    colour: '#dc241f'
  },
  {
    _id: ObjectId('5cbb57d78832730876626d14'),
    name: 'Liberal Democrats',
    enabled: true,
    createdDate: ISODate('2019-04-20T17:33:11.597Z'),
    colour: '#faa61b'
  },
  {
    _id: ObjectId('5cbb57eb8832730876626d15'),
    name: 'Scottish National Party',
    enabled: true,
    createdDate: ISODate('2019-04-20T17:33:01.556Z'),
    colour: '#fef987'
  },
  {
    _id: ObjectId('5cbb582e8832730876626d16'),
    name: 'Green Party',
    enabled: true,
    createdDate: ISODate('2019-04-20T17:34:38.418Z'),
    colour: '#6aaf23'
  }
])
