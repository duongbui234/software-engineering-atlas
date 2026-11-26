use std::collections::{BinaryHeap, HashMap, HashSet};
use std::iter;

#[derive(Default)]
struct Twitter {
    clock: usize,
    tweets: HashMap<i32, Vec<(usize, i32)>>,
    following: HashMap<i32, HashSet<i32>>,
}

impl Twitter {
    fn post_tweet(&mut self, user_id: i32, tweet_id: i32) {
        self.tweets
            .entry(user_id)
            .or_default()
            .push((self.clock, tweet_id));
        self.clock += 1;
    }

    fn get_news_feed(&self, user_id: i32) -> Vec<i32> {
        let followed = self.following.get(&user_id).into_iter().flatten().copied();
        let sources = iter::once(user_id).chain(followed);
        let newest: Vec<_> = sources
            .filter_map(|author| {
                let history = self.tweets.get(&author)?;
                let &(time, _) = history.last()?;
                Some((time, author, history.len() - 1))
            })
            .collect();
        let mut ready = BinaryHeap::from(newest);

        let mut feed = Vec::new();
        while feed.len() < 10 {
            let Some((_, author, index)) = ready.pop() else {
                break;
            };
            let history = &self.tweets[&author];
            feed.push(history[index].1);
            if index > 0 {
                ready.push((history[index - 1].0, author, index - 1));
            }
        }
        feed
    }

    fn follow(&mut self, follower_id: i32, followee_id: i32) {
        if follower_id != followee_id {
            self.following
                .entry(follower_id)
                .or_default()
                .insert(followee_id);
        }
    }

    fn unfollow(&mut self, follower_id: i32, followee_id: i32) {
        if let Some(followed) = self.following.get_mut(&follower_id) {
            followed.remove(&followee_id);
        }
    }
}

fn main() {
    let mut twitter = Twitter::default();
    assert!(twitter.get_news_feed(1).is_empty());
    twitter.post_tweet(1, 5);
    assert_eq!(twitter.get_news_feed(1), [5]);
    twitter.post_tweet(2, 6);
    twitter.follow(1, 2);
    twitter.follow(1, 2);
    twitter.follow(1, 3);
    assert_eq!(twitter.get_news_feed(1), [6, 5]);
    twitter.unfollow(1, 2);
    assert_eq!(twitter.get_news_feed(1), [5]);
    twitter.follow(1, 1);
    twitter.unfollow(1, 1);
    assert_eq!(twitter.get_news_feed(1), [5]);

    let mut twitter = Twitter::default();
    twitter.follow(1, 2);
    for id in 1..=12 {
        twitter.post_tweet(1 + id % 2, id);
    }
    assert_eq!(twitter.get_news_feed(1), (3..=12).rev().collect::<Vec<_>>());
    println!("6/6 ca đúng");
}
