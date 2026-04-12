#  Chat System Sharding Simulation

This project is a **system design simulation** that explores how chat systems behave under **high load, imbalance, and failure conditions**, similar to real-world platforms like Discord.

It focuses not just on building a system, but understanding:
 *What breaks, why it breaks, and how different sharding strategies perform.*

---

##  Problem Statement

A chat platform suddenly becomes popular during a live event:

*  50,000 users join within minutes
*  One channel receives 80% of messages
*  Message rate spikes to thousands per second

The system must handle:

* Message routing
* Load distribution
* Server overload
* System failures

---

##  Core Concept

Instead of building a perfect system, this project simulates:

*  Bad design decisions
*  Load imbalance
*  Traffic spikes
*  System failures

As described in the assignment:
“you are not just implementing sharding… you are simulating imbalance, spikes, bad design decisions and their consequences.” 

---

## System Architecture

### 1. Basic Components

* **Message**

  * Contains: `user_id`, `channel_id`, `content`

* **ChatServer (Naive System)**

  * Stores all messages in one place
  * Works for small scale
  * Fails at large scale

---

### 2. Sharding System

* **Shard**

  * Independent storage unit
  * Stores messages separately

* **ShardManager**

  * Controls multiple shards
  * Routes messages to shards

---

##  Sharding Strategies Implemented

###  1. User-Based Sharding

```python
shard = user_id % number_of_shards
```

**Pros:**

* Simple
* Predictable

**Cons:**

* One active user can overload a shard
* Creates imbalance

---

###  2. Channel-Based Sharding

```python
shard = channel_id % number_of_shards
```

**Pros:**

* Keeps channel data together

**Cons:**

* Viral channel → single shard overload
* Other shards remain idle

---

###  3. Hash-Based Sharding

```python
hash(key) % number_of_shards
```

**Pros:**

* Better distribution
* Reduces hotspots

**Cons:**

* Rebalancing issues when shards increase
* Choosing correct key is tricky

---

##  Stress Simulation

The system simulates different scenarios:

###  Normal Load

* Even distribution of users and messages

###  Viral Event

* One channel dominates traffic

###  Extreme Spike

* High message volume in short time

---

## 📈 Sample Output

```
Shard 0: 1200 messages
Shard 1: 800 messages
Shard 2: 5000 messages  ⚠️ overloaded
```

---

##  Key Observations

* **Single Server**

  * Memory grows endlessly
  * No scalability

* **User-Based Sharding**

  * Fails when one user is highly active

* **Channel-Based Sharding**

  * Fails during viral events

* **Hash-Based Sharding**

  * Better, but not perfect
  * Scaling introduces complexity

---

##  Additional Features

###  Cross-Shard Query

Fetch last 10 messages of a channel:

* Collect data from multiple shards
* Merge and return results

---

###  Hotspot Detection

* Detect if one shard has >50% load
* Print warning

---

###  Failure Simulation

* Disable one shard
* Observe:

  * Data loss
  * Inconsistent results

---

##  Learning Outcomes

This project helps understand:

* System design thinking
* Sharding strategies
* Load balancing challenges
* Real-world failure scenarios
* Trade-offs in distributed systems

---

##  Final Conclusion

There is **no perfect solution**.

Each strategy:

* Solves one problem
* Creates another

 Real systems require:

* Monitoring
* Dynamic scaling
* Smart routing
* Failure handling


