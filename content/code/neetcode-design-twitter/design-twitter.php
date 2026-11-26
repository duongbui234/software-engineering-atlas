<?php
declare(strict_types=1);

final class Twitter
{
    private int $clock = 0;
    private array $tweets = [];
    private array $following = [];

    public function postTweet(int $userId, int $tweetId): void
    {
        $this->tweets[$userId][] = [$this->clock++, $tweetId];
    }

    public function getNewsFeed(int $userId): array
    {
        $sources = [$userId => true] + ($this->following[$userId] ?? []);
        $ready = new SplPriorityQueue();
        foreach ($sources as $author => $_) {
            $index = count($this->tweets[$author] ?? []) - 1;
            if ($index >= 0) {
                $ready->insert([$author, $index], $this->tweets[$author][$index][0]);
            }
        }

        $feed = [];
        while (!$ready->isEmpty() && count($feed) < 10) {
            [$author, $index] = $ready->extract();
            $feed[] = $this->tweets[$author][$index][1];
            if ($index > 0) {
                $previous = $index - 1;
                $ready->insert([$author, $previous], $this->tweets[$author][$previous][0]);
            }
        }
        return $feed;
    }

    public function follow(int $followerId, int $followeeId): void
    {
        if ($followerId !== $followeeId) {
            $this->following[$followerId][$followeeId] = true;
        }
    }

    public function unfollow(int $followerId, int $followeeId): void
    {
        unset($this->following[$followerId][$followeeId]);
    }
}

function checkFeed(Twitter $twitter, int $userId, array $expected): void
{
    $actual = $twitter->getNewsFeed($userId);
    if ($actual !== $expected) {
        throw new RuntimeException('Feed sai: ' . json_encode($actual));
    }
}

$twitter = new Twitter();
checkFeed($twitter, 1, []);
$twitter->postTweet(1, 5);
checkFeed($twitter, 1, [5]);
$twitter->postTweet(2, 6);
$twitter->follow(1, 2);
$twitter->follow(1, 2);
$twitter->follow(1, 3);
checkFeed($twitter, 1, [6, 5]);
$twitter->unfollow(1, 2);
checkFeed($twitter, 1, [5]);
$twitter->follow(1, 1);
$twitter->unfollow(1, 1);
checkFeed($twitter, 1, [5]);

$twitter = new Twitter();
$twitter->follow(1, 2);
for ($i = 1; $i <= 12; $i++) {
    $twitter->postTweet(1 + $i % 2, $i);
}
checkFeed($twitter, 1, range(12, 3));
echo "6/6 ca đúng\n";
