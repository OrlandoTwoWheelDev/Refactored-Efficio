// __tests__/teams.test.ts
import { createTeamWithOwner } from '../../db/teams';
import pool from '../../db/pool';

// Mock pool.query
jest.mock('../../db/pool', () => {
  const originalModule = jest.requireActual('../../db/pool');
  return {
    ...originalModule,
    query: jest.fn(),
  };
});

const mockedQuery = pool.query as jest.Mock;

// Reset before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('createTeamWithOwner', () => {
  it('should create a team and assign the owner if user exists', async () => {
    // Arrange: Mock the SELECT for user and INSERTs
    mockedQuery
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [{ username: 'a10leeroy' }] }) // SELECT user
      .mockResolvedValueOnce({
        rows: [{ id: 1, teamname: 'My Team', createdat: '2024-01-01' }],
      }) // INSERT INTO teams
      .mockResolvedValueOnce({}) // INSERT INTO teamsusers
      .mockResolvedValueOnce({}); // COMMIT

    // Act
    const result = await createTeamWithOwner('My Team', 'a10leeroy');

    // Assert
    expect(result).toEqual({
      id: 1,
      teamname: 'My Team',
      createdat: expect.any(String),
    });
    expect(mockedQuery).toHaveBeenCalledTimes(5); // BEGIN, SELECT, INSERT, INSERT, COMMIT
  });

  it('should throw an error if user does not exist', async () => {
    // Arrange: Mock user not found
    mockedQuery
  .mockResolvedValueOnce({}) // BEGIN
  .mockResolvedValueOnce({ rows: [] }) // SELECT user
  .mockResolvedValueOnce({}); // ROLLBACK


    // Act & Assert
    await expect(
      createTeamWithOwner('Ghost Peppers', 'ghosty'),
    ).rejects.toThrow('User not found');

    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining('SELECT username FROM users'),
      ['ghosty'],
    );
  });

  it('should rollback on error and rethrow', async () => {
    // Arrange: Mock a user found, but fail on inserting team
    mockedQuery
  .mockResolvedValueOnce({}) // BEGIN
  .mockResolvedValueOnce({ rows: [{ username: 'a10leeroy' }] }) // SELECT
  .mockRejectedValueOnce(new Error('DB insert error')) // INSERT teams
  .mockResolvedValueOnce({}); // ROLLBACK


    // Act & Assert
    await expect(createTeamWithOwner('FailTeam', 'a10leeroy')).rejects.toThrow(
      'DB insert error',
    );

    expect(mockedQuery).toHaveBeenCalledWith('ROLLBACK');
  });
});
