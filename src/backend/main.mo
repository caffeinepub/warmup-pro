import MixinStorage "blob-storage/Mixin";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";
import Map "mo:core/Map";

actor {
  include MixinStorage();

  type Exercise = {
    id : Text;
    title : Text;
    image : Storage.ExternalBlob;
    video : Storage.ExternalBlob;
    order : Nat;
  };

  module Exercise {
    public func compare(a : Exercise, b : Exercise) : Order.Order {
      Nat.compare(a.order, b.order);
    };
  };

  let exercises = Map.empty<Text, Exercise>();

  public shared ({ caller }) func addExercise(id : Text, title : Text, image : Storage.ExternalBlob, video : Storage.ExternalBlob, order : Nat) : async () {
    let exercise : Exercise = {
      id;
      title;
      image;
      video;
      order;
    };
    exercises.add(id, exercise);
  };

  public query ({ caller }) func find(id : Text) : async Exercise {
    switch (exercises.get(id)) {
      case (null) { Runtime.trap("Exercise does not exist") };
      case (?exercise) { exercise };
    };
  };

  public query ({ caller }) func getPreviousExercise(id : Text) : async Exercise {
    let current = switch (exercises.get(id)) {
      case (null) { Runtime.trap("Exercise does not exist") };
      case (?exercise) { exercise };
    };

    let prevOrder = if (current.order > 1) { current.order - 1 } else {
      Runtime.trap("No previous exercise");
    };

    let iter = exercises.values();
    switch (iter.find(func(e) { e.order == prevOrder })) {
      case (null) { Runtime.trap("Previous exercise not found") };
      case (?exercise) { exercise };
    };
  };

  public query ({ caller }) func getNextExercise(id : Text) : async Exercise {
    let current = switch (exercises.get(id)) {
      case (null) { Runtime.trap("Exercise does not exist") };
      case (?exercise) { exercise };
    };

    let nextOrder = current.order + 1;

    let iter = exercises.values();
    switch (iter.find(func(e) { e.order == nextOrder })) {
      case (null) { Runtime.trap("Next exercise not found") };
      case (?exercise) { exercise };
    };
  };

  public query ({ caller }) func getAllExercises() : async [Exercise] {
    let exerciseList = List.empty<Exercise>();
    exercises.forEach(func(_, exercise) { exerciseList.add(exercise) });
    exerciseList.toArray().sort();
  };
};
