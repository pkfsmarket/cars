var zd = Object.defineProperty,
  Wd = Object.defineProperties;
var qd = Object.getOwnPropertyDescriptors;
var fa = Object.getOwnPropertySymbols;
var Zd = Object.prototype.hasOwnProperty,
  Yd = Object.prototype.propertyIsEnumerable;
var ha = (e, t, n) =>
    t in e
      ? zd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  O = (e, t) => {
    for (var n in (t ||= {})) Zd.call(t, n) && ha(e, n, t[n]);
    if (fa) for (var n of fa(t)) Yd.call(t, n) && ha(e, n, t[n]);
    return e;
  },
  L = (e, t) => Wd(e, qd(t));
var Bt = (e, t, n) =>
  new Promise((r, o) => {
    var i = (u) => {
        try {
          a(n.next(u));
        } catch (c) {
          o(c);
        }
      },
      s = (u) => {
        try {
          a(n.throw(u));
        } catch (c) {
          o(c);
        }
      },
      a = (u) => (u.done ? r(u.value) : Promise.resolve(u.value).then(i, s));
    a((n = n.apply(e, t)).next());
  });
function To(e, t) {
  return Object.is(e, t);
}
var j = null,
  Nn = !1,
  So = 1,
  de = Symbol('SIGNAL');
function I(e) {
  let t = j;
  return (j = e), t;
}
function pa() {
  return j;
}
var $t = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function No(e) {
  if (Nn) throw new Error('');
  if (j === null) return;
  j.consumerOnSignalRead(e);
  let t = j.nextProducerIndex++;
  if ((Rn(j), t < j.producerNode.length && j.producerNode[t] !== e && Ht(j))) {
    let n = j.producerNode[t];
    On(n, j.producerIndexOfThis[t]);
  }
  j.producerNode[t] !== e &&
    ((j.producerNode[t] = e),
    (j.producerIndexOfThis[t] = Ht(j) ? ya(e, j, t) : 0)),
    (j.producerLastReadVersion[t] = e.version);
}
function Qd() {
  So++;
}
function xo(e) {
  if (!(Ht(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === So)) {
    if (!e.producerMustRecompute(e) && !Oo(e)) {
      Mo(e);
      return;
    }
    e.producerRecomputeValue(e), Mo(e);
  }
}
function ga(e) {
  if (e.liveConsumerNode === void 0) return;
  let t = Nn;
  Nn = !0;
  try {
    for (let n of e.liveConsumerNode) n.dirty || Kd(n);
  } finally {
    Nn = t;
  }
}
function ma() {
  return j?.consumerAllowSignalWrites !== !1;
}
function Kd(e) {
  (e.dirty = !0), ga(e), e.consumerMarkedDirty?.(e);
}
function Mo(e) {
  (e.dirty = !1), (e.lastCleanEpoch = So);
}
function An(e) {
  return e && (e.nextProducerIndex = 0), I(e);
}
function Ao(e, t) {
  if (
    (I(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Ht(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        On(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Oo(e) {
  Rn(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (xo(n), r !== n.version)) return !0;
  }
  return !1;
}
function Ro(e) {
  if ((Rn(e), Ht(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      On(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function ya(e, t, n) {
  if ((va(e), e.liveConsumerNode.length === 0 && Da(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = ya(e.producerNode[r], e, r);
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
}
function On(e, t) {
  if ((va(e), e.liveConsumerNode.length === 1 && Da(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      On(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    Rn(o), (o.producerIndexOfThis[r] = t);
  }
}
function Ht(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Rn(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function va(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function Da(e) {
  return e.producerNode !== void 0;
}
function Ea(e) {
  let t = Object.create(Jd);
  t.computation = e;
  let n = () => {
    if ((xo(t), No(t), t.value === xn)) throw t.error;
    return t.value;
  };
  return (n[de] = t), n;
}
var Io = Symbol('UNSET'),
  bo = Symbol('COMPUTING'),
  xn = Symbol('ERRORED'),
  Jd = L(O({}, $t), {
    value: Io,
    dirty: !0,
    error: null,
    equal: To,
    producerMustRecompute(e) {
      return e.value === Io || e.value === bo;
    },
    producerRecomputeValue(e) {
      if (e.value === bo) throw new Error('Detected cycle in computations.');
      let t = e.value;
      e.value = bo;
      let n = An(e),
        r;
      try {
        r = e.computation();
      } catch (o) {
        (r = xn), (e.error = o);
      } finally {
        Ao(e, n);
      }
      if (t !== Io && t !== xn && r !== xn && e.equal(t, r)) {
        e.value = t;
        return;
      }
      (e.value = r), e.version++;
    },
  });
function Xd() {
  throw new Error();
}
var Ca = Xd;
function _a() {
  Ca();
}
function wa(e) {
  Ca = e;
}
var ef = null;
function Ia(e) {
  let t = Object.create(Ma);
  t.value = e;
  let n = () => (No(t), t.value);
  return (n[de] = t), n;
}
function Fo(e, t) {
  ma() || _a(), e.equal(e.value, t) || ((e.value = t), tf(e));
}
function ba(e, t) {
  ma() || _a(), Fo(e, t(e.value));
}
var Ma = L(O({}, $t), { equal: To, value: void 0 });
function tf(e) {
  e.version++, Qd(), ga(e), ef?.();
}
function b(e) {
  return typeof e == 'function';
}
function Fn(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Pn = Fn(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n);
    }
);
function Ut(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var q = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (b(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Pn ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Ta(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Pn ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Pn(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Ta(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && Ut(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && Ut(n, t), t instanceof e && t._removeParent(this);
  }
};
q.EMPTY = (() => {
  let e = new q();
  return (e.closed = !0), e;
})();
var Po = q.EMPTY;
function kn(e) {
  return (
    e instanceof q ||
    (e && 'closed' in e && b(e.remove) && b(e.add) && b(e.unsubscribe))
  );
}
function Ta(e) {
  b(e) ? e() : e.unsubscribe();
}
var fe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var lt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = lt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = lt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Ln(e) {
  lt.setTimeout(() => {
    let { onUnhandledError: t } = fe;
    if (t) t(e);
    else throw e;
  });
}
function ko() {}
var Sa = Lo('C', void 0, void 0);
function Na(e) {
  return Lo('E', void 0, e);
}
function xa(e) {
  return Lo('N', e, void 0);
}
function Lo(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Ye = null;
function dt(e) {
  if (fe.useDeprecatedSynchronousErrorHandling) {
    let t = !Ye;
    if ((t && (Ye = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Ye;
      if (((Ye = null), n)) throw r;
    }
  } else e();
}
function Aa(e) {
  fe.useDeprecatedSynchronousErrorHandling &&
    Ye &&
    ((Ye.errorThrown = !0), (Ye.error = e));
}
var Qe = class extends q {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), kn(t) && t.add(this))
          : (this.destination = of);
    }
    static create(t, n, r) {
      return new ft(t, n, r);
    }
    next(t) {
      this.isStopped ? jo(xa(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? jo(Na(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? jo(Sa, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  nf = Function.prototype.bind;
function Vo(e, t) {
  return nf.call(e, t);
}
var Bo = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Vn(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Vn(r);
        }
      else Vn(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Vn(n);
        }
    }
  },
  ft = class extends Qe {
    constructor(t, n, r) {
      super();
      let o;
      if (b(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && fe.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && Vo(t.next, i),
              error: t.error && Vo(t.error, i),
              complete: t.complete && Vo(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Bo(o);
    }
  };
function Vn(e) {
  fe.useDeprecatedSynchronousErrorHandling ? Aa(e) : Ln(e);
}
function rf(e) {
  throw e;
}
function jo(e, t) {
  let { onStoppedNotification: n } = fe;
  n && lt.setTimeout(() => n(e, t));
}
var of = { closed: !0, next: ko, error: rf, complete: ko };
var ht = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function Oa(e) {
  return e;
}
function Ra(e) {
  return e.length === 0
    ? Oa
    : e.length === 1
    ? e[0]
    : function (n) {
        return e.reduce((r, o) => o(r), n);
      };
}
var k = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = af(n) ? n : new ft(n, r, o);
      return (
        dt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Fa(r)),
        new r((o, i) => {
          let s = new ft({
            next: (a) => {
              try {
                n(a);
              } catch (u) {
                i(u), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [ht]() {
      return this;
    }
    pipe(...n) {
      return Ra(n)(this);
    }
    toPromise(n) {
      return (
        (n = Fa(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function Fa(e) {
  var t;
  return (t = e ?? fe.Promise) !== null && t !== void 0 ? t : Promise;
}
function sf(e) {
  return e && b(e.next) && b(e.error) && b(e.complete);
}
function af(e) {
  return (e && e instanceof Qe) || (sf(e) && kn(e));
}
function uf(e) {
  return b(e?.lift);
}
function Q(e) {
  return (t) => {
    if (uf(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function K(e, t, n, r, o) {
  return new Ho(e, t, n, r, o);
}
var Ho = class extends Qe {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (u) {
              t.error(u);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (u) {
              t.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
var Pa = Fn(
  (e) =>
    function () {
      e(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed');
    }
);
var Me = (() => {
    class e extends k {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new jn(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Pa();
      }
      next(n) {
        dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        dt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Po
          : ((this.currentObservers = null),
            i.push(n),
            new q(() => {
              (this.currentObservers = null), Ut(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new k();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new jn(t, n)), e;
  })(),
  jn = class extends Me {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : Po;
    }
  };
var Gt = class extends Me {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
function ka(e) {
  return e && b(e.schedule);
}
function La(e) {
  return e[e.length - 1];
}
function Va(e) {
  return b(La(e)) ? e.pop() : void 0;
}
function ja(e) {
  return ka(La(e)) ? e.pop() : void 0;
}
function Ha(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        c(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? i(l.value) : o(l.value).then(a, u);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
function Ba(e) {
  var t = typeof Symbol == 'function' && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == 'number')
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
  );
}
function Ke(e) {
  return this instanceof Ke ? ((this.v = e), this) : new Ke(e);
}
function $a(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype
    )),
    a('next'),
    a('throw'),
    a('return', s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (p) {
      return Promise.resolve(p).then(f, d);
    };
  }
  function a(f, p) {
    r[f] &&
      ((o[f] = function (g) {
        return new Promise(function (m, E) {
          i.push([f, g, m, E]) > 1 || u(f, g);
        });
      }),
      p && (o[f] = p(o[f])));
  }
  function u(f, p) {
    try {
      c(r[f](p));
    } catch (g) {
      h(i[0][3], g);
    }
  }
  function c(f) {
    f.value instanceof Ke
      ? Promise.resolve(f.value.v).then(l, d)
      : h(i[0][2], f);
  }
  function l(f) {
    u('next', f);
  }
  function d(f) {
    u('throw', f);
  }
  function h(f, p) {
    f(p), i.shift(), i.length && u(i[0][0], i[0][1]);
  }
}
function Ua(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Ba == 'function' ? Ba(e) : e[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = e[i](s)), o(a, u, s.done, s.value);
        });
      };
  }
  function o(i, s, a, u) {
    Promise.resolve(u).then(function (c) {
      i({ value: c, done: a });
    }, s);
  }
}
var Bn = (e) => e && typeof e.length == 'number' && typeof e != 'function';
function Hn(e) {
  return b(e?.then);
}
function $n(e) {
  return b(e[ht]);
}
function Un(e) {
  return Symbol.asyncIterator && b(e?.[Symbol.asyncIterator]);
}
function Gn(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == 'object' ? 'an invalid object' : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function cf() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator;
}
var zn = cf();
function Wn(e) {
  return b(e?.[zn]);
}
function qn(e) {
  return $a(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Ke(n.read());
        if (o) return yield Ke(void 0);
        yield yield Ke(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Zn(e) {
  return b(e?.getReader);
}
function J(e) {
  if (e instanceof k) return e;
  if (e != null) {
    if ($n(e)) return lf(e);
    if (Bn(e)) return df(e);
    if (Hn(e)) return ff(e);
    if (Un(e)) return Ga(e);
    if (Wn(e)) return hf(e);
    if (Zn(e)) return pf(e);
  }
  throw Gn(e);
}
function lf(e) {
  return new k((t) => {
    let n = e[ht]();
    if (b(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable'
    );
  });
}
function df(e) {
  return new k((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function ff(e) {
  return new k((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, Ln);
  });
}
function hf(e) {
  return new k((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Ga(e) {
  return new k((t) => {
    gf(e, t).catch((n) => t.error(n));
  });
}
function pf(e) {
  return Ga(qn(e));
}
function gf(e, t) {
  var n, r, o, i;
  return Ha(this, void 0, void 0, function* () {
    try {
      for (n = Ua(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function oe(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function Yn(e, t = 0) {
  return Q((n, r) => {
    n.subscribe(
      K(
        r,
        (o) => oe(r, e, () => r.next(o), t),
        () => oe(r, e, () => r.complete(), t),
        (o) => oe(r, e, () => r.error(o), t)
      )
    );
  });
}
function Qn(e, t = 0) {
  return Q((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function za(e, t) {
  return J(e).pipe(Qn(t), Yn(t));
}
function Wa(e, t) {
  return J(e).pipe(Qn(t), Yn(t));
}
function qa(e, t) {
  return new k((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Za(e, t) {
  return new k((n) => {
    let r;
    return (
      oe(n, t, () => {
        (r = e[zn]()),
          oe(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => b(r?.return) && r.return()
    );
  });
}
function Kn(e, t) {
  if (!e) throw new Error('Iterable cannot be null');
  return new k((n) => {
    oe(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      oe(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Ya(e, t) {
  return Kn(qn(e), t);
}
function Qa(e, t) {
  if (e != null) {
    if ($n(e)) return za(e, t);
    if (Bn(e)) return qa(e, t);
    if (Hn(e)) return Wa(e, t);
    if (Un(e)) return Kn(e, t);
    if (Wn(e)) return Za(e, t);
    if (Zn(e)) return Ya(e, t);
  }
  throw Gn(e);
}
function Je(e, t) {
  return t ? Qa(e, t) : J(e);
}
function Jn(...e) {
  let t = ja(e);
  return Je(e, t);
}
function X(e, t) {
  return Q((n, r) => {
    let o = 0;
    n.subscribe(
      K(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: mf } = Array;
function yf(e, t) {
  return mf(t) ? e(...t) : e(t);
}
function Ka(e) {
  return X((t) => yf(e, t));
}
var { isArray: vf } = Array,
  { getPrototypeOf: Df, prototype: Ef, keys: Cf } = Object;
function Ja(e) {
  if (e.length === 1) {
    let t = e[0];
    if (vf(t)) return { args: t, keys: null };
    if (_f(t)) {
      let n = Cf(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function _f(e) {
  return e && typeof e == 'object' && Df(e) === Ef;
}
function Xa(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function eu(e, t, n, r, o, i, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    h = () => {
      d && !u.length && !c && t.complete();
    },
    f = (g) => (c < r ? p(g) : u.push(g)),
    p = (g) => {
      i && t.next(g), c++;
      let m = !1;
      J(n(g, l++)).subscribe(
        K(
          t,
          (E) => {
            o?.(E), i ? f(E) : t.next(E);
          },
          () => {
            m = !0;
          },
          void 0,
          () => {
            if (m)
              try {
                for (c--; u.length && c < r; ) {
                  let E = u.shift();
                  s ? oe(t, s, () => p(E)) : p(E);
                }
                h();
              } catch (E) {
                t.error(E);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      K(t, f, () => {
        (d = !0), h();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Xn(e, t, n = 1 / 0) {
  return b(t)
    ? Xn((r, o) => X((i, s) => t(r, i, o, s))(J(e(r, o))), n)
    : (typeof t == 'number' && (n = t), Q((r, o) => eu(r, o, e, n)));
}
function $o(...e) {
  let t = Va(e),
    { args: n, keys: r } = Ja(e),
    o = new k((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        u = s,
        c = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        J(n[l]).subscribe(
          K(
            i,
            (h) => {
              d || ((d = !0), c--), (a[l] = h);
            },
            () => u--,
            void 0,
            () => {
              (!u || !d) && (c || i.next(r ? Xa(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(Ka(t)) : o;
}
function Uo(e, t) {
  return Q((n, r) => {
    let o = 0;
    n.subscribe(K(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function Go(e, t) {
  return b(t) ? Xn(e, t, 1) : Xn(e, 1);
}
function zo(e) {
  return Q((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Wo(e, t) {
  return Q((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      K(
        r,
        (u) => {
          o?.unsubscribe();
          let c = 0,
            l = i++;
          J(e(u, l)).subscribe(
            (o = K(
              r,
              (d) => r.next(t ? t(u, d, l, c++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
var Lu = 'https://g.co/ng/security#xss',
  C = class extends Error {
    code;
    constructor(t, n) {
      super(Mr(t, n)), (this.code = t);
    }
  };
function Mr(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ': ' + t : ''}`;
}
function Tr(e) {
  return { toString: e }.toString();
}
function P(e) {
  for (let t in e) if (e[t] === P) return t;
  throw Error('Could not find renamed property on target object.');
}
function wf(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function ae(e) {
  if (typeof e == 'string') return e;
  if (Array.isArray(e)) return '[' + e.map(ae).join(', ') + ']';
  if (e == null) return '' + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return '' + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function tu(e, t) {
  return e == null || e === ''
    ? t === null
      ? ''
      : t
    : t == null || t === ''
    ? e
    : e + ' ' + t;
}
var If = P({ __forward_ref__: P });
function $e(e) {
  return (
    (e.__forward_ref__ = $e),
    (e.toString = function () {
      return ae(this());
    }),
    e
  );
}
function Z(e) {
  return Vu(e) ? e() : e;
}
function Vu(e) {
  return (
    typeof e == 'function' && e.hasOwnProperty(If) && e.__forward_ref__ === $e
  );
}
function A(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function sn(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Xi(e) {
  return nu(e, ju) || nu(e, Bu);
}
function nu(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function bf(e) {
  let t = e && (e[ju] || e[Bu]);
  return t || null;
}
function ru(e) {
  return e && (e.hasOwnProperty(ou) || e.hasOwnProperty(Mf)) ? e[ou] : null;
}
var ju = P({ ɵprov: P }),
  ou = P({ ɵinj: P }),
  Bu = P({ ngInjectableDef: P }),
  Mf = P({ ngInjectorDef: P }),
  v = class {
    _desc;
    ngMetadataName = 'InjectionToken';
    ɵprov;
    constructor(t, n) {
      (this._desc = t),
        (this.ɵprov = void 0),
        typeof n == 'number'
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = A({
              token: this,
              providedIn: n.providedIn || 'root',
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Hu(e) {
  return e && !!e.ɵproviders;
}
var Tf = P({ ɵcmp: P }),
  Sf = P({ ɵdir: P }),
  Nf = P({ ɵpipe: P });
var ar = P({ ɵfac: P }),
  Zt = P({ __NG_ELEMENT_ID__: P }),
  iu = P({ __NG_ENV_ID__: P });
function Sr(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e);
}
function xf(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
    ? e.type.name || e.type.toString()
    : Sr(e);
}
function Af(e, t) {
  let n = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : '';
  throw new C(-200, e);
}
function es(e, t) {
  throw new C(-201, !1);
}
var M = (function (e) {
    return (
      (e[(e.Default = 0)] = 'Default'),
      (e[(e.Host = 1)] = 'Host'),
      (e[(e.Self = 2)] = 'Self'),
      (e[(e.SkipSelf = 4)] = 'SkipSelf'),
      (e[(e.Optional = 8)] = 'Optional'),
      e
    );
  })(M || {}),
  ii;
function $u() {
  return ii;
}
function ie(e) {
  let t = ii;
  return (ii = e), t;
}
function Uu(e, t, n) {
  let r = Xi(e);
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & M.Optional) return null;
  if (t !== void 0) return t;
  es(e, 'Injector');
}
var Of = {},
  Yt = Of,
  Rf = '__NG_DI_FLAG__',
  ur = 'ngTempTokenPath',
  Ff = 'ngTokenPath',
  Pf = /\n/gm,
  kf = '\u0275',
  su = '__source',
  yt;
function Lf() {
  return yt;
}
function ke(e) {
  let t = yt;
  return (yt = e), t;
}
function Vf(e, t = M.Default) {
  if (yt === void 0) throw new C(-203, !1);
  return yt === null
    ? Uu(e, void 0, t)
    : yt.get(e, t & M.Optional ? null : void 0, t);
}
function T(e, t = M.Default) {
  return ($u() || Vf)(Z(e), t);
}
function D(e, t = M.Default) {
  return T(e, Nr(t));
}
function Nr(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function si(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = Z(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new C(900, !1);
      let o,
        i = M.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = jf(a);
        typeof u == 'number' ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a);
      }
      t.push(T(o, i));
    } else t.push(T(r));
  }
  return t;
}
function jf(e) {
  return e[Rf];
}
function Bf(e, t, n, r) {
  let o = e[ur];
  throw (
    (t[su] && o.unshift(t[su]),
    (e.message = Hf(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[Ff] = o),
    (e[ur] = null),
    e)
  );
}
function Hf(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == kf
      ? e.slice(2)
      : e;
  let o = ae(t);
  if (Array.isArray(t)) o = t.map(ae).join(' -> ');
  else if (typeof t == 'object') {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : ae(a)));
      }
    o = `{${i.join(', ')}}`;
  }
  return `${n}${r ? '(' + r + ')' : ''}[${o}]: ${e.replace(
    Pf,
    `
  `
  )}`;
}
function Dt(e, t) {
  let n = e.hasOwnProperty(ar);
  return n ? e[ar] : null;
}
function ts(e, t) {
  e.forEach((n) => (Array.isArray(n) ? ts(n, t) : t(n)));
}
function $f(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Gu(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Uf(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function Gf(e, t, n) {
  let r = an(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), Uf(e, r, t, n)), r;
}
function qo(e, t) {
  let n = an(e, t);
  if (n >= 0) return e[n | 1];
}
function an(e, t) {
  return zf(e, t, 1);
}
function zf(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var Et = {},
  se = [],
  Qt = new v(''),
  zu = new v('', -1),
  Wu = new v(''),
  cr = class {
    get(t, n = Yt) {
      if (n === Yt) {
        let r = new Error(`NullInjectorError: No provider for ${ae(t)}!`);
        throw ((r.name = 'NullInjectorError'), r);
      }
      return n;
    }
  };
function xr(e) {
  return e[Tf] || null;
}
function qu(e) {
  return e[Sf] || null;
}
function Zu(e) {
  return e[Nf] || null;
}
function Wf(e) {
  let t = xr(e) || qu(e) || Zu(e);
  return t !== null && t.standalone;
}
function ns(e) {
  return { ɵproviders: e };
}
function qf(...e) {
  return { ɵproviders: Yu(!0, e), ɵfromNgModule: !0 };
}
function Yu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    ts(t, (s) => {
      let a = s;
      ai(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Qu(o, i),
    n
  );
}
function Qu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    rs(o, (i) => {
      t(i, r);
    });
  }
}
function ai(e, t, n, r) {
  if (((e = Z(e)), !e)) return !1;
  let o = null,
    i = ru(e),
    s = !i && xr(e);
  if (!i && !s) {
    let u = e.ngModule;
    if (((i = ru(u)), i)) o = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let u =
        typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let c of u) ai(c, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let c;
      try {
        ts(i.imports, (l) => {
          ai(l, t, n, r) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && Qu(c, t);
    }
    if (!a) {
      let c = Dt(o) || (() => new o());
      t({ provide: o, useFactory: c, deps: se }, o),
        t({ provide: Wu, useValue: o, multi: !0 }, o),
        t({ provide: Qt, useValue: () => T(o), multi: !0 }, o);
    }
    let u = i.providers;
    if (u != null && !a) {
      let c = e;
      rs(u, (l) => {
        t(l, c);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function rs(e, t) {
  for (let n of e)
    Hu(n) && (n = n.ɵproviders), Array.isArray(n) ? rs(n, t) : t(n);
}
var Zf = P({ provide: String, useValue: P });
function Ku(e) {
  return e !== null && typeof e == 'object' && Zf in e;
}
function Yf(e) {
  return !!(e && e.useExisting);
}
function Qf(e) {
  return !!(e && e.useFactory);
}
function Ct(e) {
  return typeof e == 'function';
}
function Kf(e) {
  return !!e.useClass;
}
var Ar = new v(''),
  nr = {},
  Jf = {},
  Zo;
function os() {
  return Zo === void 0 && (Zo = new cr()), Zo;
}
var Te = class {},
  Kt = class extends Te {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        ci(t, (s) => this.processProvider(s)),
        this.records.set(zu, pt(void 0, this)),
        o.has('environment') && this.records.set(Te, pt(void 0, this));
      let i = this.records.get(Ar);
      i != null && typeof i.value == 'string' && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Wu, se, M.Self)));
    }
    destroy() {
      Wt(this), (this._destroyed = !0);
      let t = I(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          I(t);
      }
    }
    onDestroy(t) {
      return (
        Wt(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      Wt(this);
      let n = ke(this),
        r = ie(void 0),
        o;
      try {
        return t();
      } finally {
        ke(n), ie(r);
      }
    }
    get(t, n = Yt, r = M.Default) {
      if ((Wt(this), t.hasOwnProperty(iu))) return t[iu](this);
      r = Nr(r);
      let o,
        i = ke(this),
        s = ie(void 0);
      try {
        if (!(r & M.SkipSelf)) {
          let u = this.records.get(t);
          if (u === void 0) {
            let c = rh(t) && Xi(t);
            c && this.injectableDefInScope(c)
              ? (u = pt(ui(t), nr))
              : (u = null),
              this.records.set(t, u);
          }
          if (u != null) return this.hydrate(t, u);
        }
        let a = r & M.Self ? os() : this.parent;
        return (n = r & M.Optional && n === Yt ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[ur] = a[ur] || []).unshift(ae(t)), i)) throw a;
          return Bf(a, t, 'R3InjectorError', this.source);
        } else throw a;
      } finally {
        ie(s), ke(i);
      }
    }
    resolveInjectorInitializers() {
      let t = I(null),
        n = ke(this),
        r = ie(void 0),
        o;
      try {
        let i = this.get(Qt, se, M.Self);
        for (let s of i) s();
      } finally {
        ke(n), ie(r), I(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(ae(r));
      return `R3Injector[${t.join(', ')}]`;
    }
    processProvider(t) {
      t = Z(t);
      let n = Ct(t) ? t : Z(t && t.provide),
        r = eh(t);
      if (!Ct(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = pt(void 0, nr, !0)),
          (o.factory = () => si(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = I(null);
      try {
        return (
          n.value === nr && ((n.value = Jf), (n.value = n.factory())),
          typeof n.value == 'object' &&
            n.value &&
            nh(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        I(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = Z(t.providedIn);
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function ui(e) {
  let t = Xi(e),
    n = t !== null ? t.factory : Dt(e);
  if (n !== null) return n;
  if (e instanceof v) throw new C(204, !1);
  if (e instanceof Function) return Xf(e);
  throw new C(204, !1);
}
function Xf(e) {
  if (e.length > 0) throw new C(204, !1);
  let n = bf(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function eh(e) {
  if (Ku(e)) return pt(void 0, e.useValue);
  {
    let t = Ju(e);
    return pt(t, nr);
  }
}
function Ju(e, t, n) {
  let r;
  if (Ct(e)) {
    let o = Z(e);
    return Dt(o) || ui(o);
  } else if (Ku(e)) r = () => Z(e.useValue);
  else if (Qf(e)) r = () => e.useFactory(...si(e.deps || []));
  else if (Yf(e)) r = () => T(Z(e.useExisting));
  else {
    let o = Z(e && (e.useClass || e.provide));
    if (th(e)) r = () => new o(...si(e.deps));
    else return Dt(o) || ui(o);
  }
  return r;
}
function Wt(e) {
  if (e.destroyed) throw new C(205, !1);
}
function pt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function th(e) {
  return !!e.deps;
}
function nh(e) {
  return (
    e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function'
  );
}
function rh(e) {
  return typeof e == 'function' || (typeof e == 'object' && e instanceof v);
}
function ci(e, t) {
  for (let n of e)
    Array.isArray(n) ? ci(n, t) : n && Hu(n) ? ci(n.ɵproviders, t) : t(n);
}
function Or(e, t) {
  e instanceof Kt && Wt(e);
  let n,
    r = ke(e),
    o = ie(void 0);
  try {
    return t();
  } finally {
    ke(r), ie(o);
  }
}
function oh() {
  return $u() !== void 0 || Lf() != null;
}
var Ae = 0,
  _ = 1,
  y = 2,
  ue = 3,
  pe = 4,
  Ce = 5,
  Jt = 6,
  lr = 7,
  z = 8,
  _t = 9,
  Se = 10,
  G = 11,
  Xt = 12,
  au = 13,
  xt = 14,
  De = 15,
  wt = 16,
  gt = 17,
  It = 18,
  Rr = 19,
  Xu = 20,
  Le = 21,
  Yo = 22,
  dr = 23,
  ne = 24,
  ce = 25,
  ec = 1;
var en = 7,
  ih = 8,
  fr = 9,
  ee = 10,
  hr = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      e
    );
  })(hr || {});
function Ve(e) {
  return Array.isArray(e) && typeof e[ec] == 'object';
}
function st(e) {
  return Array.isArray(e) && e[ec] === !0;
}
function tc(e) {
  return (e.flags & 4) !== 0;
}
function is(e) {
  return e.componentOffset > -1;
}
function ss(e) {
  return (e.flags & 1) === 1;
}
function je(e) {
  return !!e.template;
}
function li(e) {
  return (e[y] & 512) !== 0;
}
var di = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function nc(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var Fr = (() => {
  let e = () => rc;
  return (e.ngInherit = !0), e;
})();
function rc(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = ah), sh;
}
function sh() {
  let e = ic(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Et) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function ah(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = ic(e) || uh(e, { previous: Et, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i];
  (a[i] = new di(c && c.currentValue, n, u === Et)), nc(e, t, o, n);
}
var oc = '__ngSimpleChanges__';
function ic(e) {
  return e[oc] || null;
}
function uh(e, t) {
  return (e[oc] = t);
}
var uu = null;
var ye = function (e, t, n) {
    uu?.(e, t, n);
  },
  ch = 'svg',
  lh = 'math';
function Ne(e) {
  for (; Array.isArray(e); ) e = e[Ae];
  return e;
}
function sc(e, t) {
  return Ne(t[e]);
}
function ge(e, t) {
  return Ne(t[e.index]);
}
function as(e, t) {
  return e.data[t];
}
function dh(e, t) {
  return e[t];
}
function at(e, t) {
  let n = t[e];
  return Ve(n) ? n : n[Ae];
}
function us(e) {
  return (e[y] & 128) === 128;
}
function bt(e, t) {
  return t == null ? null : e[t];
}
function ac(e) {
  e[gt] = 0;
}
function cs(e) {
  e[y] & 1024 || ((e[y] |= 1024), us(e) && kr(e));
}
function fh(e, t) {
  for (; e > 0; ) (t = t[xt]), e--;
  return t;
}
function Pr(e) {
  return !!(e[y] & 9216 || e[ne]?.dirty);
}
function fi(e) {
  e[Se].changeDetectionScheduler?.notify(9),
    e[y] & 64 && (e[y] |= 1024),
    Pr(e) && kr(e);
}
function kr(e) {
  e[Se].changeDetectionScheduler?.notify(0);
  let t = Xe(e);
  for (; t !== null && !(t[y] & 8192 || ((t[y] |= 8192), !us(t))); ) t = Xe(t);
}
function uc(e, t) {
  if ((e[y] & 256) === 256) throw new C(911, !1);
  e[Le] === null && (e[Le] = []), e[Le].push(t);
}
function hh(e, t) {
  if (e[Le] === null) return;
  let n = e[Le].indexOf(t);
  n !== -1 && e[Le].splice(n, 1);
}
function Xe(e) {
  let t = e[ue];
  return st(t) ? t[ue] : t;
}
var w = { lFrame: mc(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var hi = !1;
function ph() {
  return w.lFrame.elementDepthCount;
}
function gh() {
  w.lFrame.elementDepthCount++;
}
function mh() {
  w.lFrame.elementDepthCount--;
}
function cc() {
  return w.bindingsEnabled;
}
function yh() {
  return w.skipHydrationRootTNode !== null;
}
function vh(e) {
  return w.skipHydrationRootTNode === e;
}
function Dh() {
  w.skipHydrationRootTNode = null;
}
function R() {
  return w.lFrame.lView;
}
function re() {
  return w.lFrame.tView;
}
function Lr(e) {
  return (w.lFrame.contextLView = e), e[z];
}
function Vr(e) {
  return (w.lFrame.contextLView = null), e;
}
function _e() {
  let e = lc();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function lc() {
  return w.lFrame.currentTNode;
}
function Eh() {
  let e = w.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function un(e, t) {
  let n = w.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function dc() {
  return w.lFrame.isParent;
}
function Ch() {
  w.lFrame.isParent = !1;
}
function _h() {
  return w.lFrame.contextLView;
}
function fc() {
  return hi;
}
function cu(e) {
  let t = hi;
  return (hi = e), t;
}
function wh() {
  let e = w.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function Ih(e) {
  return (w.lFrame.bindingIndex = e);
}
function cn() {
  return w.lFrame.bindingIndex++;
}
function bh(e) {
  let t = w.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function Mh() {
  return w.lFrame.inI18n;
}
function Th(e, t) {
  let n = w.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), pi(t);
}
function Sh() {
  return w.lFrame.currentDirectiveIndex;
}
function pi(e) {
  w.lFrame.currentDirectiveIndex = e;
}
function Nh(e) {
  let t = w.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function hc(e) {
  w.lFrame.currentQueryIndex = e;
}
function xh(e) {
  let t = e[_];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ce] : null;
}
function pc(e, t, n) {
  if (n & M.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & M.Host); )
      if (((o = xh(i)), o === null || ((i = i[xt]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (w.lFrame = gc());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function ls(e) {
  let t = gc(),
    n = e[_];
  (w.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function gc() {
  let e = w.lFrame,
    t = e === null ? null : e.child;
  return t === null ? mc(e) : t;
}
function mc(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function yc() {
  let e = w.lFrame;
  return (w.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var vc = yc;
function ds() {
  let e = yc();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Ah(e) {
  return (w.lFrame.contextLView = fh(e, w.lFrame.contextLView))[z];
}
function ut() {
  return w.lFrame.selectedIndex;
}
function et(e) {
  w.lFrame.selectedIndex = e;
}
function fs() {
  let e = w.lFrame;
  return as(e.tView, e.selectedIndex);
}
function Oh() {
  return w.lFrame.currentNamespace;
}
var Dc = !0;
function hs() {
  return Dc;
}
function ps(e) {
  Dc = e;
}
function Rh(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = rc(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function gs(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      u && (e.viewHooks ??= []).push(-n, u),
      c &&
        ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function rr(e, t, n) {
  Ec(e, t, 3, n);
}
function or(e, t, n, r) {
  (e[y] & 3) === n && Ec(e, t, n, r);
}
function Qo(e, t) {
  let n = e[y];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[y] = n));
}
function Ec(e, t, n, r) {
  let o = r !== void 0 ? e[gt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let u = o; u < s; u++)
    if (typeof t[u + 1] == 'number') {
      if (((a = t[u]), r != null && a >= r)) break;
    } else
      t[u] < 0 && (e[gt] += 65536),
        (a < i || i == -1) &&
          (Fh(e, n, t, u), (e[gt] = (e[gt] & 4294901760) + u + 2)),
        u++;
}
function lu(e, t) {
  ye(4, e, t);
  let n = I(null);
  try {
    t.call(e);
  } finally {
    I(n), ye(5, e, t);
  }
}
function Fh(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[y] >> 14 < e[gt] >> 16 &&
      (e[y] & 3) === t &&
      ((e[y] += 16384), lu(a, i))
    : lu(a, i);
}
var vt = -1,
  tt = class {
    factory;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r) {
      (this.factory = t), (this.canSeeViewProviders = n), (this.injectImpl = r);
    }
  };
function Ph(e) {
  return e instanceof tt;
}
function kh(e) {
  return (e.flags & 8) !== 0;
}
function Lh(e) {
  return (e.flags & 16) !== 0;
}
function gi(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == 'number') {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      jh(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Vh(e) {
  return e === 3 || e === 4 || e === 6;
}
function jh(e) {
  return e.charCodeAt(0) === 64;
}
function tn(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == 'number'
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? du(e, n, o, null, t[++r])
              : du(e, n, o, null, null));
      }
    }
  return e;
}
function du(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == 'number') {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == 'number') break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var Ko = {},
  mi = class {
    injector;
    parentInjector;
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = Nr(r);
      let o = this.injector.get(t, Ko, r);
      return o !== Ko || n === Ko ? o : this.parentInjector.get(t, n, r);
    }
  };
function Bh(e) {
  return e !== vt;
}
function yi(e) {
  return e & 32767;
}
function Hh(e) {
  return e >> 16;
}
function vi(e, t) {
  let n = Hh(e),
    r = t;
  for (; n > 0; ) (r = r[xt]), n--;
  return r;
}
var Di = !0;
function fu(e) {
  let t = Di;
  return (Di = e), t;
}
var $h = 256,
  Cc = $h - 1,
  _c = 5,
  Uh = 0,
  ve = {};
function Gh(e, t, n) {
  let r;
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Zt) && (r = n[Zt]),
    r == null && (r = n[Zt] = Uh++);
  let o = r & Cc,
    i = 1 << o;
  t.data[e + (o >> _c)] |= i;
}
function pr(e, t) {
  let n = wc(e, t);
  if (n !== -1) return n;
  let r = t[_];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Jo(r.data, e),
    Jo(t, null),
    Jo(r.blueprint, null));
  let o = Ic(e, t),
    i = e.injectorIndex;
  if (Bh(o)) {
    let s = yi(o),
      a = vi(o, t),
      u = a[_].data;
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
  }
  return (t[i + 8] = o), i;
}
function Jo(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function wc(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Ic(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Nc(o)), r === null)) return vt;
    if ((n++, (o = o[xt]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return vt;
}
function Ei(e, t, n) {
  Gh(e, t, n);
}
function bc(e, t, n) {
  if (n & M.Optional || e !== void 0) return e;
  es(t, 'NodeInjector');
}
function Mc(e, t, n, r) {
  if (
    (n & M.Optional && r === void 0 && (r = null), !(n & (M.Self | M.Host)))
  ) {
    let o = e[_t],
      i = ie(void 0);
    try {
      return o ? o.get(t, r, n & M.Optional) : Uu(t, r, n & M.Optional);
    } finally {
      ie(i);
    }
  }
  return bc(r, t, n);
}
function Tc(e, t, n, r = M.Default, o) {
  if (e !== null) {
    if (t[y] & 2048 && !(r & M.Self)) {
      let s = Yh(e, t, n, r, ve);
      if (s !== ve) return s;
    }
    let i = Sc(e, t, n, r, ve);
    if (i !== ve) return i;
  }
  return Mc(t, n, r, o);
}
function Sc(e, t, n, r, o) {
  let i = qh(n);
  if (typeof i == 'function') {
    if (!pc(t, e, r)) return r & M.Host ? bc(o, n, r) : Mc(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & M.Optional))) es(n);
      else return s;
    } finally {
      vc();
    }
  } else if (typeof i == 'number') {
    let s = null,
      a = wc(e, t),
      u = vt,
      c = r & M.Host ? t[De][Ce] : null;
    for (
      (a === -1 || r & M.SkipSelf) &&
      ((u = a === -1 ? Ic(e, t) : t[a + 8]),
      u === vt || !pu(r, !1)
        ? (a = -1)
        : ((s = t[_]), (a = yi(u)), (t = vi(u, t))));
      a !== -1;

    ) {
      let l = t[_];
      if (hu(i, a, l.data)) {
        let d = zh(a, t, n, s, r, c);
        if (d !== ve) return d;
      }
      (u = t[a + 8]),
        u !== vt && pu(r, t[_].data[a + 8] === c) && hu(i, a, t)
          ? ((s = l), (a = yi(u)), (t = vi(u, t)))
          : (a = -1);
    }
  }
  return o;
}
function zh(e, t, n, r, o, i) {
  let s = t[_],
    a = s.data[e + 8],
    u = r == null ? is(a) && Di : r != s && (a.type & 3) !== 0,
    c = o & M.Host && i === a,
    l = Wh(a, s, n, u, c);
  return l !== null ? Mt(t, s, l, a) : ve;
}
function Wh(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    h = o ? a + l : c;
  for (let f = d; f < h; f++) {
    let p = s[f];
    if ((f < u && n === p) || (f >= u && p.type === n)) return f;
  }
  if (o) {
    let f = s[u];
    if (f && je(f) && f.type === n) return u;
  }
  return null;
}
function Mt(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Ph(o)) {
    let s = o;
    s.resolving && Af(xf(i[n]));
    let a = fu(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? ie(s.injectImpl) : null,
      l = pc(e, r, M.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Rh(n, i[n], t);
    } finally {
      c !== null && ie(c), fu(a), (s.resolving = !1), vc();
    }
  }
  return o;
}
function qh(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(Zt) ? e[Zt] : void 0;
  return typeof t == 'number' ? (t >= 0 ? t & Cc : Zh) : t;
}
function hu(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> _c)] & r);
}
function pu(e, t) {
  return !(e & M.Self) && !(e & M.Host && t);
}
var gr = class {
  _tNode;
  _lView;
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return Tc(this._tNode, this._lView, t, Nr(r), n);
  }
};
function Zh() {
  return new gr(_e(), R());
}
function jr(e) {
  return Tr(() => {
    let t = e.prototype.constructor,
      n = t[ar] || Ci(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[ar] || Ci(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Ci(e) {
  return Vu(e)
    ? () => {
        let t = Ci(Z(e));
        return t && t();
      }
    : Dt(e);
}
function Yh(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[y] & 2048 && !(s[y] & 512); ) {
    let a = Sc(i, s, n, r | M.Self, ve);
    if (a !== ve) return a;
    let u = i.parent;
    if (!u) {
      let c = s[Xu];
      if (c) {
        let l = c.get(n, ve, r);
        if (l !== ve) return l;
      }
      (u = Nc(s)), (s = s[xt]);
    }
    i = u;
  }
  return o;
}
function Nc(e) {
  let t = e[_],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Ce] : null;
}
function gu(e, t = null, n = null, r) {
  let o = Qh(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function Qh(e, t = null, n = null, r, o = new Set()) {
  let i = [n || se, qf(e)];
  return (
    (r = r || (typeof e == 'object' ? void 0 : ae(e))),
    new Kt(i, t || os(), r || null, o)
  );
}
var nt = class e {
  static THROW_IF_NOT_FOUND = Yt;
  static NULL = new cr();
  static create(t, n) {
    if (Array.isArray(t)) return gu({ name: '' }, n, t, '');
    {
      let r = t.name ?? '';
      return gu({ name: r }, t.parent, t.providers, r);
    }
  }
  static ɵprov = A({ token: e, providedIn: 'any', factory: () => T(zu) });
  static __NG_ELEMENT_ID__ = -1;
};
var Kh = new v('');
Kh.__NG_ELEMENT_ID__ = (e) => {
  let t = _e();
  if (t === null) throw new C(204, !1);
  if (t.type & 2) return t.value;
  if (e & M.Optional) return null;
  throw new C(204, !1);
};
var xc = !1,
  Ac = (() => {
    class e {
      static __NG_ELEMENT_ID__ = Jh;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  _i = class extends Ac {
    _lView;
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return uc(this._lView, t), () => hh(this._lView, t);
    }
  };
function Jh() {
  return new _i(R());
}
var nn = class {},
  ms = new v('', { providedIn: 'root', factory: () => !1 });
var Oc = new v(''),
  Rc = new v(''),
  At = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      get _hasPendingTasks() {
        return this.hasPendingTasks.value;
      }
      hasPendingTasks = new Gt(!1);
      add() {
        this._hasPendingTasks || this.hasPendingTasks.next(!0);
        let n = this.taskId++;
        return this.pendingTasks.add(n), n;
      }
      has(n) {
        return this.pendingTasks.has(n);
      }
      remove(n) {
        this.pendingTasks.delete(n),
          this.pendingTasks.size === 0 &&
            this._hasPendingTasks &&
            this.hasPendingTasks.next(!1);
      }
      ngOnDestroy() {
        this.pendingTasks.clear(),
          this._hasPendingTasks && this.hasPendingTasks.next(!1);
      }
      static ɵprov = A({
        token: e,
        providedIn: 'root',
        factory: () => new e(),
      });
    }
    return e;
  })();
var wi = class extends Me {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      super(),
        (this.__isAsync = t),
        oh() &&
          ((this.destroyRef = D(Ac, { optional: !0 }) ?? void 0),
          (this.pendingTasks = D(At, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = I(null);
      try {
        super.next(t);
      } finally {
        I(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == 'object') {
        let u = t;
        (o = u.next?.bind(u)),
          (i = u.error?.bind(u)),
          (s = u.complete?.bind(u));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof q && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          t(n), r !== void 0 && this.pendingTasks?.remove(r);
        });
      };
    }
  },
  te = wi;
function mr(...e) {}
function Fc(e) {
  let t, n;
  function r() {
    e = mr;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == 'function' &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == 'function' &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function mu(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = mr;
    }
  );
}
var ys = 'isAngularZone',
  yr = ys + '_ID',
  Xh = 0,
  B = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new te(!1);
    onMicrotaskEmpty = new te(!1);
    onStable = new te(!1);
    onError = new te(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = xc,
      } = t;
      if (typeof Zone > 'u') throw new C(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        np(s);
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get(ys) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new C(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new C(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask('NgZoneEvent: ' + o, t, ep, mr, mr);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  ep = {};
function vs(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function tp(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    Fc(() => {
      (e.callbackScheduled = !1),
        Ii(e),
        (e.isCheckStableRunning = !0),
        vs(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Ii(e);
}
function np(e) {
  let t = () => {
      tp(e);
    },
    n = Xh++;
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { [ys]: !0, [yr]: n, [yr + n]: !0 },
    onInvokeTask: (r, o, i, s, a, u) => {
      if (rp(u)) return r.invokeTask(i, s, a, u);
      try {
        return yu(e), r.invokeTask(i, s, a, u);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          vu(e);
      }
    },
    onInvoke: (r, o, i, s, a, u, c) => {
      try {
        return yu(e), r.invoke(i, s, a, u, c);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !op(u) &&
          t(),
          vu(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == 'microTask'
            ? ((e._hasPendingMicrotasks = s.microTask), Ii(e), vs(e))
            : s.change == 'macroTask' &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Ii(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function yu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function vu(e) {
  e._nesting--, vs(e);
}
var bi = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new te();
  onMicrotaskEmpty = new te();
  onStable = new te();
  onError = new te();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function rp(e) {
  return Pc(e, '__ignore_ng_zone__');
}
function op(e) {
  return Pc(e, '__scheduler_tick__');
}
function Pc(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var Be = class {
    _console = console;
    handleError(t) {
      this._console.error('ERROR', t);
    }
  },
  ip = new v('', {
    providedIn: 'root',
    factory: () => {
      let e = D(B),
        t = D(Be);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function sp() {
  return kc(_e(), R());
}
function kc(e, t) {
  return new ln(ge(e, t));
}
var ln = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = sp;
  }
  return e;
})();
function Lc(e) {
  return (e.flags & 128) === 128;
}
var Vc = (function (e) {
    return (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e;
  })(Vc || {}),
  jc = new Map(),
  ap = 0;
function up() {
  return ap++;
}
function cp(e) {
  jc.set(e[Rr], e);
}
function Mi(e) {
  jc.delete(e[Rr]);
}
var Du = '__ngContext__';
function rt(e, t) {
  Ve(t) ? ((e[Du] = t[Rr]), cp(t)) : (e[Du] = t);
}
function Bc(e) {
  return $c(e[Xt]);
}
function Hc(e) {
  return $c(e[pe]);
}
function $c(e) {
  for (; e !== null && !st(e); ) e = e[pe];
  return e;
}
var Ti;
function Uc(e) {
  Ti = e;
}
function lp() {
  if (Ti !== void 0) return Ti;
  if (typeof document < 'u') return document;
  throw new C(210, !1);
}
var Ds = new v('', { providedIn: 'root', factory: () => dp }),
  dp = 'ng',
  Es = new v(''),
  Ue = new v('', { providedIn: 'platform', factory: () => 'unknown' });
var Cs = new v('', {
  providedIn: 'root',
  factory: () =>
    lp().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
});
var fp = 'h',
  hp = 'b';
var Gc = !1,
  pp = new v('', { providedIn: 'root', factory: () => Gc });
var zc = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = 'CHANGE_DETECTION'),
      (e[(e.AFTER_NEXT_RENDER = 1)] = 'AFTER_NEXT_RENDER'),
      e
    );
  })(zc || {}),
  Wc = new v(''),
  Eu = new Set();
function ct(e) {
  Eu.has(e) ||
    (Eu.add(e),
    performance?.mark?.('mark_feature_usage', { detail: { feature: e } }));
}
var gp = (() => {
  class e {
    impl = null;
    execute() {
      this.impl?.execute();
    }
    static ɵprov = A({ token: e, providedIn: 'root', factory: () => new e() });
  }
  return e;
})();
var mp = () => null;
function _s(e, t, n = !1) {
  return mp(e, t, n);
}
var Ee = (function (e) {
  return (
    (e[(e.Emulated = 0)] = 'Emulated'),
    (e[(e.None = 2)] = 'None'),
    (e[(e.ShadowDom = 3)] = 'ShadowDom'),
    e
  );
})(Ee || {});
var vr = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Lu})`;
  }
};
function Br(e) {
  return e instanceof vr ? e.changingThisBreaksApplicationSecurity : e;
}
function qc(e, t) {
  let n = yp(e);
  if (n != null && n !== t) {
    if (n === 'ResourceURL' && t === 'URL') return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Lu})`);
  }
  return n === t;
}
function yp(e) {
  return (e instanceof vr && e.getTypeName()) || null;
}
var vp = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Zc(e) {
  return (e = String(e)), e.match(vp) ? e : 'unsafe:' + e;
}
var ws = (function (e) {
  return (
    (e[(e.NONE = 0)] = 'NONE'),
    (e[(e.HTML = 1)] = 'HTML'),
    (e[(e.STYLE = 2)] = 'STYLE'),
    (e[(e.SCRIPT = 3)] = 'SCRIPT'),
    (e[(e.URL = 4)] = 'URL'),
    (e[(e.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    e
  );
})(ws || {});
function Yc(e) {
  let t = Dp();
  return t ? t.sanitize(ws.URL, e) || '' : qc(e, 'URL') ? Br(e) : Zc(Sr(e));
}
function Dp() {
  let e = R();
  return e && e[Se].sanitizer;
}
var He = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.SignalBased = 1)] = 'SignalBased'),
      (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      e
    );
  })(He || {}),
  xe = (function (e) {
    return (
      (e[(e.Important = 1)] = 'Important'),
      (e[(e.DashCase = 2)] = 'DashCase'),
      e
    );
  })(xe || {}),
  Ep;
function Is(e, t) {
  return Ep(e, t);
}
function mt(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    st(r) ? (i = r) : Ve(r) && ((s = !0), (r = r[Ae]));
    let a = Ne(r);
    e === 0 && n !== null
      ? o == null
        ? Xc(t, n, a)
        : Si(t, n, a, o || null, !0)
      : e === 1 && n !== null
      ? Si(t, n, a, o || null, !0)
      : e === 2
      ? Pp(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && Lp(t, e, i, n, o);
  }
}
function Cp(e, t) {
  return e.createText(t);
}
function _p(e, t, n) {
  e.setValue(t, n);
}
function Qc(e, t, n) {
  return e.createElement(t, n);
}
function wp(e, t) {
  Kc(e, t), (t[Ae] = null), (t[Ce] = null);
}
function Ip(e, t, n, r, o, i) {
  (r[Ae] = o), (r[Ce] = t), Hr(e, r, n, 1, o, i);
}
function Kc(e, t) {
  t[Se].changeDetectionScheduler?.notify(10), Hr(e, t, t[G], 2, null, null);
}
function bp(e) {
  let t = e[Xt];
  if (!t) return Xo(e[_], e);
  for (; t; ) {
    let n = null;
    if (Ve(t)) n = t[Xt];
    else {
      let r = t[ee];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[pe] && t !== e; ) Ve(t) && Xo(t[_], t), (t = t[ue]);
      t === null && (t = e), Ve(t) && Xo(t[_], t), (n = t && t[pe]);
    }
    t = n;
  }
}
function Mp(e, t, n, r) {
  let o = ee + r,
    i = n.length;
  r > 0 && (n[o - 1][pe] = t),
    r < i - ee
      ? ((t[pe] = n[o]), $f(n, ee + r, t))
      : (n.push(t), (t[pe] = null)),
    (t[ue] = n);
  let s = t[wt];
  s !== null && n !== s && Jc(s, t);
  let a = t[It];
  a !== null && a.insertView(e), fi(t), (t[y] |= 128);
}
function Jc(e, t) {
  let n = e[fr],
    r = t[ue];
  if (Ve(r)) e[y] |= hr.HasTransplantedViews;
  else {
    let o = r[ue][De];
    t[De] !== o && (e[y] |= hr.HasTransplantedViews);
  }
  n === null ? (e[fr] = [t]) : n.push(t);
}
function bs(e, t) {
  let n = e[fr],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Ms(e, t) {
  if (e.length <= ee) return;
  let n = ee + t,
    r = e[n];
  if (r) {
    let o = r[wt];
    o !== null && o !== e && bs(o, r), t > 0 && (e[n - 1][pe] = r[pe]);
    let i = Gu(e, ee + t);
    wp(r[_], r);
    let s = i[It];
    s !== null && s.detachView(i[_]),
      (r[ue] = null),
      (r[pe] = null),
      (r[y] &= -129);
  }
  return r;
}
function Ts(e, t) {
  if (!(t[y] & 256)) {
    let n = t[G];
    n.destroyNode && Hr(e, t, n, 3, null, null), bp(t);
  }
}
function Xo(e, t) {
  if (t[y] & 256) return;
  let n = I(null);
  try {
    (t[y] &= -129),
      (t[y] |= 256),
      t[ne] && Ro(t[ne]),
      Sp(e, t),
      Tp(e, t),
      t[_].type === 1 && t[G].destroy();
    let r = t[wt];
    if (r !== null && st(t[ue])) {
      r !== t[ue] && bs(r, t);
      let o = t[It];
      o !== null && o.detachView(e);
    }
    Mi(t);
  } finally {
    I(n);
  }
}
function Tp(e, t) {
  let n = e.cleanup,
    r = t[lr];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let a = n[s + 3];
        a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2);
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[lr] = null);
  let o = t[Le];
  if (o !== null) {
    t[Le] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[dr];
  if (i !== null) {
    t[dr] = null;
    for (let s of i) s.destroy();
  }
}
function Sp(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof tt)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              u = i[s + 1];
            ye(4, a, u);
            try {
              u.call(a);
            } finally {
              ye(5, a, u);
            }
          }
        else {
          ye(4, o, i);
          try {
            i.call(o);
          } finally {
            ye(5, o, i);
          }
        }
      }
    }
}
function Np(e, t, n) {
  return xp(e, t.parent, n);
}
function xp(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Ae];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Ee.None || i === Ee.Emulated) return null;
    }
    return ge(r, n);
  }
}
function Si(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Xc(e, t, n) {
  e.appendChild(t, n);
}
function Cu(e, t, n, r, o) {
  r !== null ? Si(e, t, n, r, o) : Xc(e, t, n);
}
function Ap(e, t) {
  return e.parentNode(t);
}
function Op(e, t, n) {
  return Fp(e, t, n);
}
function Rp(e, t, n) {
  return e.type & 40 ? ge(e, n) : null;
}
var Fp = Rp,
  _u;
function Ss(e, t, n, r) {
  let o = Np(e, r, t),
    i = t[G],
    s = r.parent || t[Ce],
    a = Op(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) Cu(i, o, n[u], a, !1);
    else Cu(i, o, n, a, !1);
  _u !== void 0 && _u(i, r, t, n, o);
}
function qt(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return ge(t, e);
    if (n & 4) return Ni(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return qt(e, r);
      {
        let o = e[t.index];
        return st(o) ? Ni(-1, o) : Ne(o);
      }
    } else {
      if (n & 128) return qt(e, t.next);
      if (n & 32) return Is(t, e)() || Ne(e[t.index]);
      {
        let r = el(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = Xe(e[De]);
          return qt(o, r);
        } else return qt(e, t.next);
      }
    }
  }
  return null;
}
function el(e, t) {
  if (t !== null) {
    let r = e[De][Ce],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Ni(e, t) {
  let n = ee + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[_].firstChild;
    if (o !== null) return qt(r, o);
  }
  return t[en];
}
function Pp(e, t, n) {
  e.removeChild(null, t, n);
}
function Ns(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      u = n.type;
    if (
      (s && t === 0 && (a && rt(Ne(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) Ns(e, t, n.child, r, o, i, !1), mt(t, e, o, a, i);
      else if (u & 32) {
        let c = Is(n, r),
          l;
        for (; (l = c()); ) mt(t, e, o, l, i);
        mt(t, e, o, a, i);
      } else u & 16 ? kp(e, t, r, n, o, i) : mt(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Hr(e, t, n, r, o, i) {
  Ns(n, r, e.firstChild, t, o, i, !1);
}
function kp(e, t, n, r, o, i) {
  let s = n[De],
    u = s[Ce].projection[r.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      mt(t, e, o, l, i);
    }
  else {
    let c = u,
      l = s[ue];
    Lc(r) && (c.flags |= 128), Ns(e, t, c, l, o, i, !0);
  }
}
function Lp(e, t, n, r, o) {
  let i = n[en],
    s = Ne(n);
  i !== s && mt(t, e, r, i, o);
  for (let a = ee; a < n.length; a++) {
    let u = n[a];
    Hr(u[_], u, e, t, r, i);
  }
}
function Vp(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf('-') === -1 ? void 0 : xe.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == 'string' &&
          o.endsWith('!important') &&
          ((o = o.slice(0, -10)), (i |= xe.Important)),
        e.setStyle(n, r, o, i));
  }
}
function jp(e, t, n) {
  e.setAttribute(t, 'style', n);
}
function tl(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n);
}
function nl(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && gi(e, t, r),
    o !== null && tl(e, t, o),
    i !== null && jp(e, t, i);
}
function Bp(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var rl = 'ng-template';
function Hp(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == 'string'; o += 2)
      if (t[o] === 'class' && Bp(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (xs(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == 'string'; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function xs(e) {
  return e.type === 4 && e.value !== rl;
}
function $p(e, t, n) {
  let r = e.type === 4 && !n ? rl : e.value;
  return t === r;
}
function Up(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Wp(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let u = t[a];
    if (typeof u == 'number') {
      if (!s && !he(r) && !he(u)) return !1;
      if (s && he(u)) continue;
      (s = !1), (r = u | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== '' && !$p(e, u, n)) || (u === '' && t.length === 1))
        ) {
          if (he(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Hp(e, o, u, n)) {
          if (he(r)) return !1;
          s = !0;
        }
      } else {
        let c = t[++a],
          l = Gp(u, o, xs(e), n);
        if (l === -1) {
          if (he(r)) return !1;
          s = !0;
          continue;
        }
        if (c !== '') {
          let d;
          if (
            (l > i ? (d = '') : (d = o[l + 1].toLowerCase()), r & 2 && c !== d)
          ) {
            if (he(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return he(r) || s;
}
function he(e) {
  return (e & 1) === 0;
}
function Gp(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == 'string'; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return qp(t, e);
}
function zp(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Up(e, t[r], n)) return !0;
  return !1;
}
function Wp(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Vh(n)) return t;
  }
  return e.length;
}
function qp(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == 'number') return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function wu(e, t) {
  return e ? ':not(' + t.trim() + ')' : t;
}
function Zp(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = '',
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n];
        o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else r & 8 ? (o += '.' + s) : r & 4 && (o += ' ' + s);
    else
      o !== '' && !he(s) && ((t += wu(i, o)), (o = '')),
        (r = s),
        (i = i || !he(r));
    n++;
  }
  return o !== '' && (t += wu(i, o)), t;
}
function Yp(e) {
  return e.map(Zp).join(',');
}
function Qp(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == 'string')
      o === 2 ? i !== '' && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!he(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
var Oe = {};
function W(e = 1) {
  ol(re(), R(), ut() + e, !1);
}
function ol(e, t, n, r) {
  if (!r)
    if ((t[y] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && rr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && or(t, i, 0, n);
    }
  et(n);
}
function H(e, t = M.Default) {
  let n = R();
  if (n === null) return T(e, t);
  let r = _e();
  return Tc(r, n, Z(e), t);
}
function il(e, t, n, r, o, i) {
  let s = I(null);
  try {
    let a = null;
    o & He.SignalBased && (a = t[r][de]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & He.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : nc(t, a, r, i);
  } finally {
    I(s);
  }
}
function Kp(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) et(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          Th(s, i);
          let u = t[i];
          a(2, u);
        }
      }
    } finally {
      et(-1);
    }
}
function $r(e, t, n, r, o, i, s, a, u, c, l) {
  let d = t.blueprint.slice();
  return (
    (d[Ae] = o),
    (d[y] = r | 4 | 128 | 8 | 64 | 1024),
    (c !== null || (e && e[y] & 2048)) && (d[y] |= 2048),
    ac(d),
    (d[ue] = d[xt] = e),
    (d[z] = n),
    (d[Se] = s || (e && e[Se])),
    (d[G] = a || (e && e[G])),
    (d[_t] = u || (e && e[_t]) || null),
    (d[Ce] = i),
    (d[Rr] = up()),
    (d[Jt] = l),
    (d[Xu] = c),
    (d[De] = t.type == 2 ? e[De] : d),
    d
  );
}
function Ur(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = Jp(e, t, n, r, o)), Mh() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = Eh();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return un(i, !0), i;
}
function Jp(e, t, n, r, o) {
  let i = lc(),
    s = dc(),
    a = s ? i : i && i.parent,
    u = (e.data[t] = rg(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  );
}
function sl(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function al(e, t, n, r, o) {
  let i = ut(),
    s = r & 2;
  try {
    et(-1), s && t.length > ce && ol(e, t, ce, !1), ye(s ? 2 : 0, o), n(r, o);
  } finally {
    et(i), ye(s ? 3 : 1, o);
  }
}
function ul(e, t, n) {
  if (tc(t)) {
    let r = I(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let u = n[s];
          a.contentQueries(1, u, s);
        }
      }
    } finally {
      I(r);
    }
  }
}
function cl(e, t, n) {
  cc() && (cg(e, t, n, ge(n, t)), (n.flags & 64) === 64 && gl(e, t, n));
}
function ll(e, t, n = ge) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function dl(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = As(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function As(e, t, n, r, o, i, s, a, u, c, l) {
  let d = ce + r,
    h = d + o,
    f = Xp(d, h),
    p = typeof c == 'function' ? c() : c;
  return (f[_] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == 'function' ? i() : i,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: u,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function Xp(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Oe);
  return n;
}
function eg(e, t, n, r) {
  let i = r.get(pp, Gc) || n === Ee.ShadowDom,
    s = e.selectRootElement(t, i);
  return tg(s), s;
}
function tg(e) {
  ng(e);
}
var ng = () => null;
function rg(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    yh() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Iu(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      u = He.None;
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
    let c = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      c = o[i];
    }
    e === 0 ? bu(r, n, c, a, u) : bu(r, n, c, a);
  }
  return r;
}
function bu(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function og(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      h = n ? n.get(d) : null,
      f = h ? h.inputs : null,
      p = h ? h.outputs : null;
    (u = Iu(0, d.inputs, l, u, f)), (c = Iu(1, d.outputs, l, c, p));
    let g = u !== null && s !== null && !xs(t) ? Eg(u, l, s) : null;
    a.push(g);
  }
  u !== null &&
    (u.hasOwnProperty('class') && (t.flags |= 8),
    u.hasOwnProperty('style') && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c);
}
function ig(e) {
  return e === 'class'
    ? 'className'
    : e === 'for'
    ? 'htmlFor'
    : e === 'formaction'
    ? 'formAction'
    : e === 'innerHtml'
    ? 'innerHTML'
    : e === 'readonly'
    ? 'readOnly'
    : e === 'tabindex'
    ? 'tabIndex'
    : e;
}
function fl(e, t, n, r, o, i, s, a) {
  let u = ge(t, n),
    c = t.inputs,
    l;
  !a && c != null && (l = c[r])
    ? (Rs(e, n, l, r, o), is(t) && sg(n, t.index))
    : t.type & 3
    ? ((r = ig(r)),
      (o = s != null ? s(o, t.value || '', r) : o),
      i.setProperty(u, r, o))
    : t.type & 12;
}
function sg(e, t) {
  let n = at(t, e);
  n[y] & 16 || (n[y] |= 64);
}
function hl(e, t, n, r) {
  if (cc()) {
    let o = r === null ? null : { '': -1 },
      i = dg(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && pl(e, t, n, s, o, a),
      o && fg(n, r, o);
  }
  n.mergedAttrs = tn(n.mergedAttrs, n.attrs);
}
function pl(e, t, n, r, o, i) {
  for (let c = 0; c < r.length; c++) Ei(pr(n, t), e, r[c].type);
  pg(n, e.data.length, r.length);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = sl(e, t, r.length, null);
  for (let c = 0; c < r.length; c++) {
    let l = r[c];
    (n.mergedAttrs = tn(n.mergedAttrs, l.hostAttrs)),
      gg(e, n, t, u, l),
      hg(u, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      u++;
  }
  og(e, n, i);
}
function ag(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    ug(s) != a && s.push(a), s.push(n, r, i);
  }
}
function ug(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == 'number' && n < 0) return n;
  }
  return 0;
}
function cg(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  is(n) && mg(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || pr(n, t),
    rt(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let u = e.data[a],
      c = Mt(t, e, a, n);
    if ((rt(c, t), s !== null && Dg(t, a - o, c, u, n, s), je(u))) {
      let l = at(n.index, t);
      l[z] = Mt(t, e, a, n);
    }
  }
}
function gl(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Sh();
  try {
    et(i);
    for (let a = r; a < o; a++) {
      let u = e.data[a],
        c = t[a];
      pi(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          lg(u, c);
    }
  } finally {
    et(-1), pi(s);
  }
}
function lg(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function dg(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (zp(t, s.selectors, !1))
        if ((r || (r = []), je(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let u = a.length;
            xi(e, t, u);
          } else r.unshift(s), xi(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function xi(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function fg(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new C(-301, !1);
      r.push(t[o], i);
    }
  }
}
function hg(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    je(t) && (n[''] = e);
  }
}
function pg(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function gg(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = Dt(o.type, !0)),
    s = new tt(i, je(o), H);
  (e.blueprint[r] = s), (n[r] = s), ag(e, t, r, sl(e, n, o.hostVars, Oe), o);
}
function ml(e) {
  let t = 16;
  return e.signals ? (t = 4096) : e.onPush && (t = 64), t;
}
function mg(e, t, n) {
  let r = ge(t, e),
    o = dl(n),
    i = e[Se].rendererFactory,
    s = Os(
      e,
      $r(
        e,
        o,
        null,
        ml(n),
        r,
        t,
        null,
        i.createRenderer(r, n),
        null,
        null,
        null
      )
    );
  e[t.index] = s;
}
function yg(e, t, n, r, o, i) {
  let s = ge(e, t);
  vg(t[G], s, i, e.value, n, r, o);
}
function vg(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? Sr(i) : s(i, r || '', o);
    e.setAttribute(t, o, a, n);
  }
}
function Dg(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++];
      il(r, n, u, c, l, d);
    }
}
function Eg(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == 'number') break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function Cg(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function yl(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = I(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          hc(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      I(r);
    }
  }
}
function Os(e, t) {
  return e[Xt] ? (e[au][pe] = t) : (e[Xt] = t), (e[au] = t), t;
}
function Ai(e, t, n) {
  hc(0);
  let r = I(null);
  try {
    t(e, n);
  } finally {
    I(r);
  }
}
function _g(e) {
  return (e[lr] ??= []);
}
function wg(e) {
  return (e.cleanup ??= []);
}
function vl(e, t) {
  let n = e[_t],
    r = n ? n.get(Be, null) : null;
  r && r.handleError(t);
}
function Rs(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      u = n[i++],
      c = t[s],
      l = e.data[s];
    il(l, c, r, a, u, o);
  }
}
function Ig(e, t, n) {
  let r = sc(t, e);
  _p(e[G], r, n);
}
function bg(e, t) {
  let n = at(t, e),
    r = n[_];
  Mg(r, n);
  let o = n[Ae];
  o !== null && n[Jt] === null && (n[Jt] = _s(o, n[_t])), Fs(r, n, n[z]);
}
function Mg(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Fs(e, t, n) {
  ls(t);
  try {
    let r = e.viewQuery;
    r !== null && Ai(1, r, n);
    let o = e.template;
    o !== null && al(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[It]?.finishViewCreation(e),
      e.staticContentQueries && yl(e, t),
      e.staticViewQueries && Ai(2, e.viewQuery, n);
    let i = e.components;
    i !== null && Tg(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[y] &= -5), ds();
  }
}
function Tg(e, t) {
  for (let n = 0; n < t.length; n++) bg(e, t[n]);
}
function Ps(e, t, n, r) {
  let o = I(null);
  try {
    let i = t.tView,
      a = e[y] & 4096 ? 4096 : 16,
      u = $r(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      c = e[t.index];
    u[wt] = c;
    let l = e[It];
    return l !== null && (u[It] = l.createEmbeddedView(i)), Fs(i, u, n), u;
  } finally {
    I(o);
  }
}
function Dl(e, t) {
  let n = ee + t;
  if (n < e.length) return e[n];
}
function ks(e, t) {
  return !t || t.firstChild === null || Lc(e);
}
function Ls(e, t, n, r = !0) {
  let o = t[_];
  if ((Mp(o, t, e, n), r)) {
    let s = Ni(n, e),
      a = t[G],
      u = Ap(a, e[en]);
    u !== null && Ip(o, e[Ce], a, t, u, s);
  }
  let i = t[Jt];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function El(e, t) {
  let n = Ms(e, t);
  return n !== void 0 && Ts(n[_], n), n;
}
function Dr(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Ne(i)), st(i) && Sg(i, r);
    let s = n.type;
    if (s & 8) Dr(e, t, n.child, r);
    else if (s & 32) {
      let a = Is(n, t),
        u;
      for (; (u = a()); ) r.push(u);
    } else if (s & 16) {
      let a = el(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let u = Xe(t[De]);
        Dr(u[_], u, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Sg(e, t) {
  for (let n = ee; n < e.length; n++) {
    let r = e[n],
      o = r[_].firstChild;
    o !== null && Dr(r[_], r, o, t);
  }
  e[en] !== e[Ae] && t.push(e[en]);
}
var Cl = [];
function Ng(e) {
  return e[ne] ?? xg(e);
}
function xg(e) {
  let t = Cl.pop() ?? Object.create(Og);
  return (t.lView = e), t;
}
function Ag(e) {
  e.lView[ne] !== e && ((e.lView = null), Cl.push(e));
}
var Og = L(O({}, $t), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    kr(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[ne] = this;
  },
});
function Rg(e) {
  let t = e[ne] ?? Object.create(Fg);
  return (t.lView = e), t;
}
var Fg = L(O({}, $t), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = Xe(e.lView);
    for (; t && !_l(t[_]); ) t = Xe(t);
    t && cs(t);
  },
  consumerOnSignalRead() {
    this.lView[ne] = this;
  },
});
function _l(e) {
  return e.type !== 2;
}
function wl(e) {
  if (e[dr] === null) return;
  let t = !0;
  for (; t; ) {
    let n = !1;
    for (let r of e[dr])
      r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone
          ? r.run()
          : r.zone.run(() => r.run()));
    t = n && !!(e[y] & 8192);
  }
}
var Pg = 100;
function Il(e, t = !0, n = 0) {
  let o = e[Se].rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    kg(e, n);
  } catch (s) {
    throw (t && vl(e, s), s);
  } finally {
    i || o.end?.();
  }
}
function kg(e, t) {
  let n = fc();
  try {
    cu(!0), Oi(e, t);
    let r = 0;
    for (; Pr(e); ) {
      if (r === Pg) throw new C(103, !1);
      r++, Oi(e, 1);
    }
  } finally {
    cu(n);
  }
}
function Lg(e, t, n, r) {
  let o = t[y];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  ls(t);
  let a = !0,
    u = null,
    c = null;
  i ||
    (_l(e)
      ? ((c = Ng(t)), (u = An(c)))
      : pa() === null
      ? ((a = !1), (c = Rg(t)), (u = An(c)))
      : t[ne] && (Ro(t[ne]), (t[ne] = null)));
  try {
    ac(t), Ih(e.bindingStartIndex), n !== null && al(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && rr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && or(t, f, 0, null), Qo(t, 0);
      }
    if (
      (s || Vg(t), wl(t), bl(t, 0), e.contentQueries !== null && yl(e, t), !i)
    )
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && rr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && or(t, f, 1), Qo(t, 1);
      }
    Kp(e, t);
    let d = e.components;
    d !== null && Tl(t, d, 0);
    let h = e.viewQuery;
    if ((h !== null && Ai(2, h, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && rr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && or(t, f, 2), Qo(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Yo])) {
      for (let f of t[Yo]) f();
      t[Yo] = null;
    }
    i || (t[y] &= -73);
  } catch (l) {
    throw (i || kr(t), l);
  } finally {
    c !== null && (Ao(c, u), a && Ag(c)), ds();
  }
}
function bl(e, t) {
  for (let n = Bc(e); n !== null; n = Hc(n))
    for (let r = ee; r < n.length; r++) {
      let o = n[r];
      Ml(o, t);
    }
}
function Vg(e) {
  for (let t = Bc(e); t !== null; t = Hc(t)) {
    if (!(t[y] & hr.HasTransplantedViews)) continue;
    let n = t[fr];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      cs(o);
    }
  }
}
function jg(e, t, n) {
  let r = at(t, e);
  Ml(r, n);
}
function Ml(e, t) {
  us(e) && Oi(e, t);
}
function Oi(e, t) {
  let r = e[_],
    o = e[y],
    i = e[ne],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Oo(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[y] &= -9217),
    s)
  )
    Lg(r, e, r.template, e[z]);
  else if (o & 8192) {
    wl(e), bl(e, 1);
    let a = r.components;
    a !== null && Tl(e, a, 1);
  }
}
function Tl(e, t, n) {
  for (let r = 0; r < t.length; r++) jg(e, t[r], n);
}
function Vs(e, t) {
  let n = fc() ? 64 : 1088;
  for (e[Se].changeDetectionScheduler?.notify(t); e; ) {
    e[y] |= n;
    let r = Xe(e);
    if (li(e) && !r) return e;
    e = r;
  }
  return null;
}
var Ri = class {
  _lView;
  _cdRefInjectingView;
  notifyErrorHandler;
  _appRef = null;
  _attachedToViewContainer = !1;
  get rootNodes() {
    let t = this._lView,
      n = t[_];
    return Dr(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r);
  }
  get context() {
    return this._lView[z];
  }
  get dirty() {
    return !!(this._lView[y] & 9280) || !!this._lView[ne]?.dirty;
  }
  set context(t) {
    this._lView[z] = t;
  }
  get destroyed() {
    return (this._lView[y] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[ue];
      if (st(t)) {
        let n = t[ih],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Ms(t, r), Gu(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Ts(this._lView[_], this._lView);
  }
  onDestroy(t) {
    uc(this._lView, t);
  }
  markForCheck() {
    Vs(this._cdRefInjectingView || this._lView, 4);
  }
  markForRefresh() {
    cs(this._cdRefInjectingView || this._lView);
  }
  detach() {
    this._lView[y] &= -129;
  }
  reattach() {
    fi(this._lView), (this._lView[y] |= 128);
  }
  detectChanges() {
    (this._lView[y] |= 1024), Il(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new C(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = li(this._lView),
      n = this._lView[wt];
    n !== null && !t && bs(n, this._lView), Kc(this._lView[_], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new C(902, !1);
    this._appRef = t;
    let n = li(this._lView),
      r = this._lView[wt];
    r !== null && !n && Jc(r, this._lView), fi(this._lView);
  }
};
var TC = new RegExp(`^(\\d+)*(${hp}|${fp})*(.*)`);
var Bg = () => null;
function js(e, t) {
  return Bg(e, t);
}
var Fi = class {},
  Er = class {},
  Pi = class {
    resolveComponentFactory(t) {
      throw Error(`No component factory found for ${ae(t)}.`);
    }
  },
  rn = class {
    static NULL = new Pi();
  },
  Tt = class {},
  Gr = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => Hg();
    }
    return e;
  })();
function Hg() {
  let e = R(),
    t = _e(),
    n = at(t.index, e);
  return (Ve(n) ? n : e)[G];
}
var $g = (() => {
  class e {
    static ɵprov = A({ token: e, providedIn: 'root', factory: () => null });
  }
  return e;
})();
function ki(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == 'number') i = a;
      else if (i == 1) o = tu(o, a);
      else if (i == 2) {
        let u = a,
          c = t[++s];
        r = tu(r, u + ': ' + c + ';');
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var Li = class extends rn {
  ngModule;
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = xr(t);
    return new Vi(n, this.ngModule);
  }
};
function Mu(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      a = i ? o[1] : He.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (a & He.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function Ug(e) {
  let t = e.toLowerCase();
  return t === 'svg' ? ch : t === 'math' ? lh : null;
}
var Vi = class extends Er {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Mu(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Mu(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = Yp(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = I(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof Te ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new mi(t, s) : t,
          u = a.get(Tt, null);
        if (u === null) throw new C(407, !1);
        let c = a.get($g, null),
          l = a.get(nn, null),
          d = { rendererFactory: u, sanitizer: c, changeDetectionScheduler: l },
          h = u.createRenderer(null, this.componentDef),
          f = this.componentDef.selectors[0][0] || 'div',
          p = r
            ? eg(h, r, this.componentDef.encapsulation, a)
            : Qc(h, f, Ug(f)),
          g = 512;
        this.componentDef.signals
          ? (g |= 4096)
          : this.componentDef.onPush || (g |= 16);
        let m = null;
        p !== null && (m = _s(p, a, !0));
        let E = As(0, null, null, 1, 0, null, null, null, null, null, null),
          F = $r(null, E, null, g, null, null, d, h, a, null, m);
        ls(F);
        let x,
          U,
          Y = null;
        try {
          let V = this.componentDef,
            be,
            wo = null;
          V.findHostDirectiveDefs
            ? ((be = []),
              (wo = new Map()),
              V.findHostDirectiveDefs(V, be, wo),
              be.push(V))
            : (be = [V]);
          let Gd = Gg(F, p);
          (Y = zg(Gd, p, V, be, F, d, h)),
            (U = as(E, ce)),
            p && Zg(h, V, p, r),
            n !== void 0 && Yg(U, this.ngContentSelectors, n),
            (x = qg(Y, V, be, wo, F, [Qg])),
            Fs(E, F, null);
        } catch (V) {
          throw (Y !== null && Mi(Y), Mi(F), V);
        } finally {
          ds();
        }
        return new ji(this.componentType, x, kc(U, F), F, U);
      } finally {
        I(i);
      }
    }
  },
  ji = class extends Fi {
    location;
    _rootLView;
    _tNode;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    previousInputValues = null;
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Ri(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        Rs(i[_], i, o, t, n), this.previousInputValues.set(t, n);
        let s = at(this._tNode.index, i);
        Vs(s, 1);
      }
    }
    get injector() {
      return new gr(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function Gg(e, t) {
  let n = e[_],
    r = ce;
  return (e[r] = t), Ur(n, r, 2, '#host', null);
}
function zg(e, t, n, r, o, i, s) {
  let a = o[_];
  Wg(r, e, t, s);
  let u = null;
  t !== null && (u = _s(t, o[_t]));
  let c = i.rendererFactory.createRenderer(t, n),
    l = $r(o, dl(n), null, ml(n), o[e.index], e, i, c, null, null, u);
  return (
    a.firstCreatePass && xi(a, e, r.length - 1), Os(o, l), (o[e.index] = l)
  );
}
function Wg(e, t, n, r) {
  for (let o of e) t.mergedAttrs = tn(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (ki(t, t.mergedAttrs, !0), n !== null && nl(r, n, t));
}
function qg(e, t, n, r, o, i) {
  let s = _e(),
    a = o[_],
    u = ge(s, o);
  pl(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      h = Mt(o, a, d, s);
    rt(h, o);
  }
  gl(a, o, s), u && rt(u, o);
  let c = Mt(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[z] = o[z] = c), i !== null)) for (let l of i) l(c, t);
  return ul(a, s, o), c;
}
function Zg(e, t, n, r) {
  if (r) gi(e, n, ['ng-version', '19.0.6']);
  else {
    let { attrs: o, classes: i } = Qp(t.selectors[0]);
    o && gi(e, n, o), i && i.length > 0 && tl(e, n, i.join(' '));
  }
}
function Yg(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
function Qg() {
  let e = _e();
  gs(R()[_], e);
}
var Kg = () => !1;
function Jg(e, t, n) {
  return Kg(e, t, n);
}
function dn(e, t) {
  ct('NgSignals');
  let n = Ia(e),
    r = n[de];
  return (
    t?.equal && (r.equal = t.equal),
    (n.set = (o) => Fo(r, o)),
    (n.update = (o) => ba(r, o)),
    (n.asReadonly = Xg.bind(n)),
    n
  );
}
function Xg() {
  let e = this[de];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[de] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
var St = class {};
var Cr = class extends St {
  injector;
  componentFactoryResolver = new Li(this);
  instance = null;
  constructor(t) {
    super();
    let n = new Kt(
      [
        ...t.providers,
        { provide: St, useValue: this },
        { provide: rn, useValue: this.componentFactoryResolver },
      ],
      t.parent || os(),
      t.debugName,
      new Set(['environment'])
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function em(e, t, n = null) {
  return new Cr({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var tm = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Yu(!1, n.type),
          o =
            r.length > 0
              ? em([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = A({
      token: e,
      providedIn: 'environment',
      factory: () => new e(T(Te)),
    });
  }
  return e;
})();
function zr(e) {
  return Tr(() => {
    let t = Sl(e),
      n = L(O({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Vc.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(tm).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Ee.Emulated,
        styles: e.styles || se,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      });
    t.standalone && ct('NgStandalone'), Nl(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Su(r, !1)), (n.pipeDefs = Su(r, !0)), (n.id = om(n)), n
    );
  });
}
function nm(e) {
  return xr(e) || qu(e);
}
function rm(e) {
  return e !== null;
}
function fn(e) {
  return Tr(() => ({
    type: e.type,
    bootstrap: e.bootstrap || se,
    declarations: e.declarations || se,
    imports: e.imports || se,
    exports: e.exports || se,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function Tu(e, t) {
  if (e == null) return Et;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = He.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== He.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function le(e) {
  return Tr(() => {
    let t = Sl(e);
    return Nl(t), t;
  });
}
function Sl(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || Et,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || se,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Tu(e.inputs, t),
    outputs: Tu(e.outputs),
    debugInfo: null,
  };
}
function Nl(e) {
  e.features?.forEach((t) => t(e));
}
function Su(e, t) {
  if (!e) return null;
  let n = t ? Zu : nm;
  return () => (typeof e == 'function' ? e() : e).map((r) => n(r)).filter(rm);
}
function om(e) {
  let t = 0,
    n = typeof e.consts == 'function' ? '' : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join('|')) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return (t += 2147483648), 'c' + t;
}
function im(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function we(e) {
  let t = im(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (je(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new C(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = er(e.inputs)),
          (s.inputTransforms = er(e.inputTransforms)),
          (s.declaredInputs = er(e.declaredInputs)),
          (s.outputs = er(e.outputs));
        let a = o.hostBindings;
        a && lm(e, a);
        let u = o.viewQuery,
          c = o.contentQueries;
        if (
          (u && um(e, u),
          c && cm(e, c),
          sm(e, o),
          wf(e.outputs, o.outputs),
          je(o) && o.data.animation)
        ) {
          let l = e.data;
          l.animation = (l.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === we && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  am(r);
}
function sm(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    if (
      r !== void 0 &&
      ((e.inputs[n] = r),
      (e.declaredInputs[n] = t.declaredInputs[n]),
      t.inputTransforms !== null)
    ) {
      let o = Array.isArray(r) ? r[0] : r;
      if (!t.inputTransforms.hasOwnProperty(o)) continue;
      (e.inputTransforms ??= {}), (e.inputTransforms[o] = t.inputTransforms[o]);
    }
  }
}
function am(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = tn(o.hostAttrs, (n = tn(n, o.hostAttrs))));
  }
}
function er(e) {
  return e === Et ? {} : e === se ? [] : e;
}
function um(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function cm(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function lm(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
function dm(e, t, n) {
  return (e[t] = n);
}
function fm(e, t) {
  return e[t];
}
function Ot(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function hm(e) {
  return (e.flags & 32) === 32;
}
function pm(e, t, n, r, o, i, s, a, u) {
  let c = t.consts,
    l = Ur(t, e, 4, s || null, a || null);
  hl(t, n, l, bt(c, u)), gs(t, l);
  let d = (l.tView = As(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    c,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function Bi(e, t, n, r, o, i, s, a, u, c) {
  let l = n + ce,
    d = t.firstCreatePass ? pm(l, t, e, r, o, i, s, a, u) : t.data[l];
  un(d, !1);
  let h = gm(t, e, d, n);
  hs() && Ss(t, e, h, d), rt(h, e);
  let f = Cg(h, e, h, d);
  return (
    (e[l] = f),
    Os(e, f),
    Jg(f, d, e),
    ss(d) && cl(t, e, d),
    u != null && ll(e, d, c),
    d
  );
}
function Bs(e, t, n, r, o, i, s, a) {
  let u = R(),
    c = re(),
    l = bt(c.consts, i);
  return Bi(u, c, e, t, n, r, o, l, s, a), Bs;
}
var gm = mm;
function mm(e, t, n, r) {
  return ps(!0), t[G].createComment('');
}
var xl = new v('');
function hn(e) {
  return !!e && typeof e.then == 'function';
}
function Al(e) {
  return !!e && typeof e.subscribe == 'function';
}
var ym = new v('');
var Ol = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        (this.resolve = n), (this.reject = r);
      });
      appInits = D(ym, { optional: !0 }) ?? [];
      injector = D(nt);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = Or(this.injector, o);
          if (hn(i)) n.push(i);
          else if (Al(i)) {
            let s = new Promise((a, u) => {
              i.subscribe({ complete: a, error: u });
            });
            n.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = A({ token: e, factory: e.ɵfac, providedIn: 'root' });
    }
    return e;
  })(),
  vm = (() => {
    class e {
      static ɵprov = A({
        token: e,
        providedIn: 'root',
        factory: () => new Hi(),
      });
    }
    return e;
  })(),
  Hi = class {
    queuedEffectCount = 0;
    queues = new Map();
    schedule(t) {
      this.enqueue(t);
    }
    remove(t) {
      let n = t.zone,
        r = this.queues.get(n);
      r.has(t) && (r.delete(t), this.queuedEffectCount--);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || (this.queuedEffectCount++, r.add(t));
    }
    flush() {
      for (; this.queuedEffectCount > 0; )
        for (let [t, n] of this.queues)
          t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n));
    }
    flushQueue(t) {
      for (let n of t) t.delete(n), this.queuedEffectCount--, n.run();
    }
  },
  Rl = new v('');
function Dm() {
  wa(() => {
    throw new C(600, !1);
  });
}
function Em(e) {
  return e.isBoundToModule;
}
var Cm = 10;
function _m(e, t, n) {
  try {
    let r = n();
    return hn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var ot = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = D(ip);
    afterRenderManager = D(gp);
    zonelessEnabled = D(ms);
    rootEffectScheduler = D(vm);
    dirtyFlags = 0;
    deferredDirtyFlags = 0;
    tracingSnapshot = null;
    externalTestViews = new Set();
    afterTick = new Me();
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    isStable = D(At).hasPendingTasks.pipe(X((n) => !n));
    constructor() {
      D(Wc, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = D(Te);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      let o = n instanceof Er;
      if (!this._injector.get(Ol).done) {
        let h = !o && Wf(n),
          f = !1;
        throw new C(405, f);
      }
      let s;
      o ? (s = n) : (s = this._injector.get(rn).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let a = Em(s) ? void 0 : this._injector.get(St),
        u = r || s.selector,
        c = s.create(nt.NULL, [], u, a),
        l = c.location.nativeElement,
        d = c.injector.get(xl, null);
      return (
        d?.registerApplication(l),
        c.onDestroy(() => {
          this.detachView(c.hostView),
            ir(this.components, c),
            d?.unregisterApplication(l);
        }),
        this._loadComponent(c),
        c
      );
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick = () => {
      if (this.tracingSnapshot !== null) {
        let r = this.tracingSnapshot;
        (this.tracingSnapshot = null),
          r.run(zc.CHANGE_DETECTION, this._tick),
          r.dispose();
        return;
      }
      if (this._runningTick) throw new C(101, !1);
      let n = I(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), I(n), this.afterTick.next();
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Tt, null, {
          optional: !0,
        })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < Cm; ) this.synchronizeOnce();
    }
    synchronizeOnce() {
      if (
        ((this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0),
        this.dirtyFlags & 16 &&
          ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush()),
        this.dirtyFlags & 7)
      ) {
        let n = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8), (this.dirtyFlags |= 8);
        for (let { _lView: r, notifyErrorHandler: o } of this.allViews)
          wm(r, o, n, this.zonelessEnabled);
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
      this.dirtyFlags & 8 &&
        ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => Pr(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(n) {
      let r = n;
      ir(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView),
        this.tick(),
        this.components.push(n),
        this._injector.get(Rl, []).forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => ir(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new C(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = A({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function ir(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function wm(e, t, n, r) {
  if (!n && !Pr(e)) return;
  Il(e, t, n && !r ? 0 : 1);
}
function Wr(e, t, n, r) {
  let o = R(),
    i = cn();
  if (Ot(o, i, t)) {
    let s = re(),
      a = fs();
    yg(a, o, e, t, n, r);
  }
  return Wr;
}
function Fl(e, t, n, r) {
  return Ot(e, cn(), n) ? t + Sr(n) + r : Oe;
}
function tr(e, t) {
  return (e << 17) | (t << 2);
}
function it(e) {
  return (e >> 17) & 32767;
}
function Im(e) {
  return (e & 2) == 2;
}
function bm(e, t) {
  return (e & 131071) | (t << 17);
}
function $i(e) {
  return e | 2;
}
function Nt(e) {
  return (e & 131068) >> 2;
}
function ei(e, t) {
  return (e & -131069) | (t << 2);
}
function Mm(e) {
  return (e & 1) === 1;
}
function Ui(e) {
  return e | 1;
}
function Tm(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = it(s),
    u = Nt(s);
  e[r] = n;
  let c = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || an(d, l) > 0) && (c = !0);
  } else l = n;
  if (o)
    if (u !== 0) {
      let h = it(e[a + 1]);
      (e[r + 1] = tr(h, a)),
        h !== 0 && (e[h + 1] = ei(e[h + 1], r)),
        (e[a + 1] = bm(e[a + 1], r));
    } else
      (e[r + 1] = tr(a, 0)), a !== 0 && (e[a + 1] = ei(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = tr(u, 0)),
      a === 0 ? (a = r) : (e[u + 1] = ei(e[u + 1], r)),
      (u = r);
  c && (e[r + 1] = $i(e[r + 1])),
    Nu(e, l, r, !0),
    Nu(e, l, r, !1),
    Sm(t, l, e, r, i),
    (s = tr(a, u)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function Sm(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == 'string' &&
    an(i, t) >= 0 &&
    (n[r + 1] = Ui(n[r + 1]));
}
function Nu(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? it(o) : Nt(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let u = e[s],
      c = e[s + 1];
    Nm(u, t) && ((a = !0), (e[s + 1] = r ? Ui(c) : $i(c))),
      (s = r ? it(c) : Nt(c));
  }
  a && (e[n + 1] = r ? $i(o) : Ui(o));
}
function Nm(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == 'string'
    ? an(e, t) >= 0
    : !1;
}
function qr(e, t, n) {
  let r = R(),
    o = cn();
  if (Ot(r, o, t)) {
    let i = re(),
      s = fs();
    fl(i, s, r, e, t, r[G], n, !1);
  }
  return qr;
}
function xu(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? 'class' : 'style';
  Rs(e, n, i[s], s, r);
}
function Re(e, t) {
  return xm(e, t, null, !0), Re;
}
function xm(e, t, n, r) {
  let o = R(),
    i = re(),
    s = bh(2);
  if ((i.firstUpdatePass && Om(i, e, s, r), t !== Oe && Ot(o, s, t))) {
    let a = i.data[ut()];
    Lm(i, a, o, o[G], e, (o[s + 1] = Vm(t, n)), r, s);
  }
}
function Am(e, t) {
  return t >= e.expandoStartIndex;
}
function Om(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[ut()],
      s = Am(e, n);
    jm(i, r) && t === null && !s && (t = !1),
      (t = Rm(o, i, t, r)),
      Tm(o, i, t, n, s, r);
  }
}
function Rm(e, t, n, r) {
  let o = Nh(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = ti(null, e, t, n, r)), (n = on(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = ti(o, e, t, n, r)), i === null)) {
        let u = Fm(e, t, r);
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = ti(null, e, t, u[1], r)),
          (u = on(u, t.attrs, r)),
          Pm(e, t, r, u));
      } else i = km(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function Fm(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (Nt(r) !== 0) return e[it(r)];
}
function Pm(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[it(o)] = r;
}
function km(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = on(r, s, n);
  }
  return on(r, t.attrs, n);
}
function ti(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = on(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function on(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == 'number'
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ['', e]),
          Gf(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function Lm(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let u = e.data,
    c = u[a + 1],
    l = Mm(c) ? Au(u, t, n, o, Nt(c), s) : void 0;
  if (!_r(l)) {
    _r(i) || (Im(c) && (i = Au(u, null, n, o, a, s)));
    let d = sc(ut(), n);
    Vp(r, s, d, o, i);
  }
}
function Au(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let u = e[o],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      h = n[o + 1];
    h === Oe && (h = d ? se : void 0);
    let f = d ? qo(h, r) : l === r ? h : void 0;
    if ((c && !_r(f) && (f = qo(u, r)), _r(f) && ((a = f), s))) return a;
    let p = e[o + 1];
    o = s ? it(p) : Nt(p);
  }
  if (t !== null) {
    let u = i ? t.residualClasses : t.residualStyles;
    u != null && (a = qo(u, r));
  }
  return a;
}
function _r(e) {
  return e !== void 0;
}
function Vm(e, t) {
  return (
    e == null ||
      e === '' ||
      (typeof t == 'string'
        ? (e = e + t)
        : typeof e == 'object' && (e = ae(Br(e)))),
    e
  );
}
function jm(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var Gi = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function ni(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function Bm(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(t)) {
    let u = t.length - 1;
    for (; i <= s && i <= u; ) {
      let c = e.at(i),
        l = t[i],
        d = ni(i, c, i, l, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, l), i++;
        continue;
      }
      let h = e.at(s),
        f = t[u],
        p = ni(s, h, u, f, n);
      if (p !== 0) {
        p < 0 && e.updateValue(s, f), s--, u--;
        continue;
      }
      let g = n(i, c),
        m = n(s, h),
        E = n(i, l);
      if (Object.is(E, m)) {
        let F = n(u, f);
        Object.is(F, g)
          ? (e.swap(i, s), e.updateValue(s, f), u--, s--)
          : e.move(s, i),
          e.updateValue(i, l),
          i++;
        continue;
      }
      if (((r ??= new wr()), (o ??= Ru(e, i, s, n)), zi(e, r, i, E)))
        e.updateValue(i, l), i++, s++;
      else if (o.has(E)) r.set(g, e.detach(i)), s--;
      else {
        let F = e.create(i, t[i]);
        e.attach(i, F), i++, s++;
      }
    }
    for (; i <= u; ) Ou(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let u = t[Symbol.iterator](),
      c = u.next();
    for (; !c.done && i <= s; ) {
      let l = e.at(i),
        d = c.value,
        h = ni(i, l, i, d, n);
      if (h !== 0) h < 0 && e.updateValue(i, d), i++, (c = u.next());
      else {
        (r ??= new wr()), (o ??= Ru(e, i, s, n));
        let f = n(i, d);
        if (zi(e, r, i, f)) e.updateValue(i, d), i++, s++, (c = u.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (c = u.next());
        else {
          let p = n(i, l);
          r.set(p, e.detach(i)), s--;
        }
      }
    }
    for (; !c.done; ) Ou(e, r, n, e.length, c.value), (c = u.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((u) => {
    e.destroy(u);
  });
}
function zi(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function Ou(e, t, n, r, o) {
  if (zi(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function Ru(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var wr = class {
  kvMap = new Map();
  _vMap = void 0;
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
function Pl(e, t) {
  ct('NgControlFlow');
  let n = R(),
    r = cn(),
    o = n[r] !== Oe ? n[r] : -1,
    i = o !== -1 ? Ir(n, ce + o) : void 0,
    s = 0;
  if (Ot(n, r, e)) {
    let a = I(null);
    try {
      if ((i !== void 0 && El(i, s), e !== -1)) {
        let u = ce + e,
          c = Ir(n, u),
          l = Yi(n[_], u),
          d = js(c, l.tView.ssrId),
          h = Ps(n, l, t, { dehydratedView: d });
        Ls(c, h, s, ks(l, d));
      }
    } finally {
      I(a);
    }
  } else if (i !== void 0) {
    let a = Dl(i, s);
    a !== void 0 && (a[z] = t);
  }
}
var Wi = class {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - ee;
  }
};
function Hs(e) {
  return e;
}
var qi = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function Zr(e, t, n, r, o, i, s, a, u, c, l, d, h) {
  ct('NgControlFlow');
  let f = R(),
    p = re(),
    g = u !== void 0,
    m = R(),
    E = a ? s.bind(m[De][z]) : s,
    F = new qi(g, E);
  (m[ce + e] = F),
    Bi(f, p, e + 1, t, n, r, o, bt(p.consts, i)),
    g && Bi(f, p, e + 2, u, c, l, d, bt(p.consts, h));
}
var Zi = class extends Gi {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r);
  }
  get length() {
    return this.lContainer.length - ee;
  }
  at(t) {
    return this.getLView(t)[z].$implicit;
  }
  attach(t, n) {
    let r = n[Jt];
    (this.needsIndexUpdate ||= t !== this.length),
      Ls(this.lContainer, n, t, ks(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), Hm(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = js(this.lContainer, this.templateTNode.tView.ssrId),
      o = Ps(
        this.hostLView,
        this.templateTNode,
        new Wi(this.lContainer, n, t),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    Ts(t[_], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[z].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[z].$index = t;
  }
  getLView(t) {
    return $m(this.lContainer, t);
  }
};
function Yr(e) {
  let t = I(null),
    n = ut();
  try {
    let r = R(),
      o = r[_],
      i = r[n],
      s = n + 1,
      a = Ir(r, s);
    if (i.liveCollection === void 0) {
      let c = Yi(o, s);
      i.liveCollection = new Zi(a, r, c);
    } else i.liveCollection.reset();
    let u = i.liveCollection;
    if ((Bm(u, e, i.trackByFn), u.updateIndexes(), i.hasEmptyBlock)) {
      let c = cn(),
        l = u.length === 0;
      if (Ot(r, c, l)) {
        let d = n + 2,
          h = Ir(r, d);
        if (l) {
          let f = Yi(o, d),
            p = js(h, f.tView.ssrId),
            g = Ps(r, f, void 0, { dehydratedView: p });
          Ls(h, g, 0, ks(f, p));
        } else El(h, 0);
      }
    }
  } finally {
    I(t);
  }
}
function Ir(e, t) {
  return e[t];
}
function Hm(e, t) {
  return Ms(e, t);
}
function $m(e, t) {
  return Dl(e, t);
}
function Yi(e, t) {
  return as(e, t);
}
function Um(e, t, n, r, o, i) {
  let s = t.consts,
    a = bt(s, o),
    u = Ur(t, e, 2, r, a);
  return (
    hl(t, n, u, bt(s, i)),
    u.attrs !== null && ki(u, u.attrs, !1),
    u.mergedAttrs !== null && ki(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  );
}
function S(e, t, n, r) {
  let o = R(),
    i = re(),
    s = ce + e,
    a = o[G],
    u = i.firstCreatePass ? Um(s, i, o, t, n, r) : i.data[s],
    c = Gm(i, o, u, a, t, e);
  o[s] = c;
  let l = ss(u);
  return (
    un(u, !0),
    nl(a, c, u),
    !hm(u) && hs() && Ss(i, o, c, u),
    ph() === 0 && rt(c, o),
    gh(),
    l && (cl(i, o, u), ul(i, u, o)),
    r !== null && ll(o, u),
    S
  );
}
function N() {
  let e = _e();
  dc() ? Ch() : ((e = e.parent), un(e, !1));
  let t = e;
  vh(t) && Dh(), mh();
  let n = re();
  return (
    n.firstCreatePass && (gs(n, e), tc(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      kh(t) &&
      xu(n, t, R(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Lh(t) &&
      xu(n, t, R(), t.stylesWithoutHost, !1),
    N
  );
}
function me(e, t, n, r) {
  return S(e, t, n, r), N(), me;
}
var Gm = (e, t, n, r, o, i) => (ps(!0), Qc(r, o, Oh()));
function Qr() {
  return R();
}
var br = 'en-US';
var zm = br;
function Wm(e) {
  typeof e == 'string' && (zm = e.toLowerCase().replace(/_/g, '-'));
}
var qm = (e, t, n) => {};
function Ge(e, t, n, r) {
  let o = R(),
    i = re(),
    s = _e();
  return Ym(i, o, o[G], s, e, t, r), Ge;
}
function Zm(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[lr],
          u = o[i + 2];
        return a.length > u ? a[u] : null;
      }
      typeof s == 'string' && (i += 2);
    }
  return null;
}
function Ym(e, t, n, r, o, i, s) {
  let a = ss(r),
    c = e.firstCreatePass && wg(e),
    l = t[z],
    d = _g(t),
    h = !0;
  if (r.type & 3 || s) {
    let g = ge(r, t),
      m = s ? s(g) : g,
      E = d.length,
      F = s ? (U) => s(Ne(U[r.index])) : r.index,
      x = null;
    if ((!s && a && (x = Zm(e, t, o, r.index)), x !== null)) {
      let U = x.__ngLastListenerFn__ || x;
      (U.__ngNextListenerFn__ = i), (x.__ngLastListenerFn__ = i), (h = !1);
    } else {
      (i = Pu(r, t, l, i)), qm(g, o, i);
      let U = n.listen(m, o, i);
      d.push(i, U), c && c.push(o, F, E, E + 1);
    }
  } else i = Pu(r, t, l, i);
  let f = r.outputs,
    p;
  if (h && f !== null && (p = f[o])) {
    let g = p.length;
    if (g)
      for (let m = 0; m < g; m += 2) {
        let E = p[m],
          F = p[m + 1],
          Y = t[E][F].subscribe(i),
          V = d.length;
        d.push(i, Y), c && c.push(o, r.index, V, -(V + 1));
      }
  }
}
function Fu(e, t, n, r) {
  let o = I(null);
  try {
    return ye(6, t, n), n(r) !== !1;
  } catch (i) {
    return vl(e, i), !1;
  } finally {
    ye(7, t, n), I(o);
  }
}
function Pu(e, t, n, r) {
  return function o(i) {
    if (i === Function) return r;
    let s = e.componentOffset > -1 ? at(e.index, t) : t;
    Vs(s, 5);
    let a = Fu(t, n, r, i),
      u = o.__ngNextListenerFn__;
    for (; u; ) (a = Fu(t, n, u, i) && a), (u = u.__ngNextListenerFn__);
    return a;
  };
}
function Kr(e = 1) {
  return Ah(e);
}
function Jr(e, t, n) {
  return kl(e, '', t, '', n), Jr;
}
function kl(e, t, n, r, o) {
  let i = R(),
    s = Fl(i, t, n, r);
  if (s !== Oe) {
    let a = re(),
      u = fs();
    fl(a, u, i, e, s, i[G], o, !1);
  }
  return kl;
}
function Ll(e) {
  let t = _h();
  return dh(t, ce + e);
}
function $(e, t = '') {
  let n = R(),
    r = re(),
    o = e + ce,
    i = r.firstCreatePass ? Ur(r, o, 1, t, null) : r.data[o],
    s = Qm(r, n, i, t, e);
  (n[o] = s), hs() && Ss(r, n, s, i), un(i, !1);
}
var Qm = (e, t, n, r, o) => (ps(!0), Cp(t[G], r));
function Xr(e) {
  return Rt('', e, ''), Xr;
}
function Rt(e, t, n) {
  let r = R(),
    o = Fl(r, e, t, n);
  return o !== Oe && Ig(r, ut(), o), Rt;
}
function Km(e, t, n) {
  let r = re();
  if (r.firstCreatePass) {
    let o = je(e);
    Qi(n, r.data, r.blueprint, o, !0), Qi(t, r.data, r.blueprint, o, !1);
  }
}
function Qi(e, t, n, r, o) {
  if (((e = Z(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) Qi(e[i], t, n, r, o);
  else {
    let i = re(),
      s = R(),
      a = _e(),
      u = Ct(e) ? e : Z(e.provide),
      c = Ju(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      h = a.providerIndexes >> 20;
    if (Ct(e) || !e.multi) {
      let f = new tt(c, o, H),
        p = oi(u, t, o ? l : l + h, d);
      p === -1
        ? (Ei(pr(a, s), i, u),
          ri(i, e, t.length),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[p] = f), (s[p] = f));
    } else {
      let f = oi(u, t, l + h, d),
        p = oi(u, t, l, l + h),
        g = f >= 0 && n[f],
        m = p >= 0 && n[p];
      if ((o && !m) || (!o && !g)) {
        Ei(pr(a, s), i, u);
        let E = ey(o ? Xm : Jm, n.length, o, r, c);
        !o && m && (n[p].providerFactory = E),
          ri(i, e, t.length, 0),
          t.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(E),
          s.push(E);
      } else {
        let E = Vl(n[o ? p : f], c, !o && r);
        ri(i, e, f > -1 ? f : p, E);
      }
      !o && r && m && n[p].componentProviders++;
    }
  }
}
function ri(e, t, n, r) {
  let o = Ct(t),
    i = Kf(t);
  if (o || i) {
    let u = (i ? Z(t.useClass) : t).prototype.ngOnDestroy;
    if (u) {
      let c = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let l = c.indexOf(n);
        l === -1 ? c.push(n, [r, u]) : c[l + 1].push(r, u);
      } else c.push(n, u);
    }
  }
}
function Vl(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function oi(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function Jm(e, t, n, r) {
  return Ki(this.multi, []);
}
function Xm(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Mt(n, n[_], this.providerFactory.index, r);
    (i = a.slice(0, s)), Ki(o, i);
    for (let u = s; u < a.length; u++) i.push(a[u]);
  } else (i = []), Ki(o, i);
  return i;
}
function Ki(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function ey(e, t, n, r, o) {
  let i = new tt(e, n, H);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    Vl(i, o, r && !n),
    i
  );
}
function Ft(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => Km(r, o ? o(e) : e, t);
  };
}
function jl(e, t, n) {
  let r = wh() + e,
    o = R();
  return o[r] === Oe ? dm(o, r, n ? t.call(n) : t()) : fm(o, r);
}
var ty = (() => {
  class e {
    zone = D(B);
    changeDetectionScheduler = D(nn);
    applicationRef = D(ot);
    _onMicrotaskEmptySubscription;
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.changeDetectionScheduler.runningTick ||
                this.zone.run(() => {
                  this.applicationRef.tick();
                });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = A({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function ny({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new B(L(O({}, ry()), { scheduleInRootZone: n }))),
    [
      { provide: B, useFactory: e },
      {
        provide: Qt,
        multi: !0,
        useFactory: () => {
          let r = D(ty, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Qt,
        multi: !0,
        useFactory: () => {
          let r = D(oy);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: Oc, useValue: !0 } : [],
      { provide: Rc, useValue: n ?? xc },
    ]
  );
}
function ry(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var oy = (() => {
  class e {
    subscription = new q();
    initialized = !1;
    zone = D(B);
    pendingTasks = D(At);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              B.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            B.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = A({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
var iy = (() => {
  class e {
    appRef = D(ot);
    taskService = D(At);
    ngZone = D(B);
    zonelessEnabled = D(ms);
    tracing = D(Wc, { optional: !0 });
    disableScheduling = D(Oc, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < 'u' && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new q();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(yr) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (D(Rc, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        })
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof bi || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      let r = !1;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 8: {
          this.appRef.deferredDirtyFlags |= 8;
          break;
        }
        case 6: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 13: {
          (this.appRef.dirtyFlags |= 16), (r = !0);
          break;
        }
        case 14: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 12: {
          r = !0;
          break;
        }
        case 10:
        case 9:
        case 7:
        case 11:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? mu : Fc;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              o(() => this.tick())
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick())
            ));
    }
    shouldScheduleTick(n) {
      return !(
        (this.disableScheduling && !n) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(yr + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (r) {
        throw (this.taskService.remove(n), r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        mu(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = A({ token: e, factory: e.ɵfac, providedIn: 'root' });
  }
  return e;
})();
function sy() {
  return (typeof $localize < 'u' && $localize.locale) || br;
}
var $s = new v('', {
  providedIn: 'root',
  factory: () => D($s, M.Optional | M.SkipSelf) || sy(),
});
var Ji = new v(''),
  ay = new v('');
function zt(e) {
  return !e.moduleRef;
}
function uy(e) {
  let t = zt(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(B);
  return n.run(() => {
    zt(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(Be, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      zt(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(Ji);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(Ji);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          ir(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return _m(r, n, () => {
      let i = t.get(Ol);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get($s, br);
          if ((Wm(s || br), !t.get(ay, !0)))
            return zt(e)
              ? t.get(ot)
              : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
          if (zt(e)) {
            let u = t.get(ot);
            return (
              e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u
            );
          } else return cy(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function cy(e, t) {
  let n = e.injector.get(ot);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new C(-403, !1);
  t.push(e);
}
var sr = null;
function ly(e = [], t) {
  return nt.create({
    name: t,
    providers: [
      { provide: Ar, useValue: 'platform' },
      { provide: Ji, useValue: new Set([() => (sr = null)]) },
      ...e,
    ],
  });
}
function dy(e = []) {
  if (sr) return sr;
  let t = ly(e);
  return (sr = t), Dm(), fy(t), t;
}
function fy(e) {
  let t = e.get(Es, null);
  Or(e, () => {
    t?.forEach((n) => n());
  });
}
function Bl(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = dy(r),
      i = [ny({}), { provide: nn, useExisting: iy }, ...(n || [])],
      s = new Cr({
        providers: i,
        parent: o,
        debugName: '',
        runEnvironmentInitializers: !1,
      });
    return uy({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
function Us(e) {
  return typeof e == 'boolean' ? e : e != null && e !== 'false';
}
function pn(e, t) {
  ct('NgSignals');
  let n = Ea(e);
  return t?.equal && (n[de].equal = t.equal), n;
}
function Fe(e) {
  let t = I(null);
  try {
    return e();
  } finally {
    I(t);
  }
}
var ku = class {
  [de];
  constructor(t) {
    this[de] = t;
  }
  destroy() {
    this[de].destroy();
  }
};
var $l = null;
function kt() {
  return $l;
}
function Ul(e) {
  $l ??= e;
}
var eo = class {};
var Ie = new v('');
function to(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(';')) {
    let r = n.indexOf('='),
      [o, i] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Gl = 'browser',
  py = 'server';
function no(e) {
  return e === py;
}
var Pt = class {};
var yn = class {},
  oo = class {},
  Pe = class e {
    headers;
    normalizedNames = new Map();
    lazyInit;
    lazyUpdate = null;
    constructor(t) {
      t
        ? typeof t == 'string'
          ? (this.lazyInit = () => {
              (this.headers = new Map()),
                t
                  .split(
                    `
`
                  )
                  .forEach((n) => {
                    let r = n.indexOf(':');
                    if (r > 0) {
                      let o = n.slice(0, r),
                        i = n.slice(r + 1).trim();
                      this.addHeaderEntry(o, i);
                    }
                  });
            })
          : typeof Headers < 'u' && t instanceof Headers
          ? ((this.headers = new Map()),
            t.forEach((n, r) => {
              this.addHeaderEntry(r, n);
            }))
          : (this.lazyInit = () => {
              (this.headers = new Map()),
                Object.entries(t).forEach(([n, r]) => {
                  this.setHeaderEntries(n, r);
                });
            })
        : (this.headers = new Map());
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase());
    }
    get(t) {
      this.init();
      let n = this.headers.get(t.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null;
    }
    append(t, n) {
      return this.clone({ name: t, value: n, op: 'a' });
    }
    set(t, n) {
      return this.clone({ name: t, value: n, op: 's' });
    }
    delete(t, n) {
      return this.clone({ name: t, value: n, op: 'd' });
    }
    maybeSetNormalizedName(t, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((n) => {
          this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n));
        });
    }
    clone(t) {
      let n = new e();
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        n
      );
    }
    applyUpdate(t) {
      let n = t.name.toLowerCase();
      switch (t.op) {
        case 'a':
        case 's':
          let r = t.value;
          if ((typeof r == 'string' && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(t.name, n);
          let o = (t.op === 'a' ? this.headers.get(n) : void 0) || [];
          o.push(...r), this.headers.set(n, o);
          break;
        case 'd':
          let i = t.value;
          if (!i) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let s = this.headers.get(n);
            if (!s) return;
            (s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s);
          }
          break;
      }
    }
    addHeaderEntry(t, n) {
      let r = t.toLowerCase();
      this.maybeSetNormalizedName(t, r),
        this.headers.has(r)
          ? this.headers.get(r).push(n)
          : this.headers.set(r, [n]);
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
        o = t.toLowerCase();
      this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          t(this.normalizedNames.get(n), this.headers.get(n))
        );
    }
  };
var zs = class {
  encodeKey(t) {
    return zl(t);
  }
  encodeValue(t) {
    return zl(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function my(e, t) {
  let n = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, '')
        .split('&')
        .forEach((o) => {
          let i = o.indexOf('='),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), '']
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            u = n.get(s) || [];
          u.push(a), n.set(s, u);
        }),
    n
  );
}
var yy = /%(\d[a-f0-9])/gi,
  vy = {
    40: '@',
    '3A': ':',
    24: '$',
    '2C': ',',
    '3B': ';',
    '3D': '=',
    '3F': '?',
    '2F': '/',
  };
function zl(e) {
  return encodeURIComponent(e).replace(yy, (t, n) => vy[n] ?? t);
}
function ro(e) {
  return `${e}`;
}
var We = class e {
  map;
  encoder;
  updates = null;
  cloneFrom = null;
  constructor(t = {}) {
    if (((this.encoder = t.encoder || new zs()), t.fromString)) {
      if (t.fromObject)
        throw new Error('Cannot specify both fromString and fromObject.');
      this.map = my(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(ro) : [ro(r)];
            this.map.set(n, o);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let n = this.map.get(t);
    return n ? n[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: 'a' });
  }
  appendAll(t) {
    let n = [];
    return (
      Object.keys(t).forEach((r) => {
        let o = t[r];
        Array.isArray(o)
          ? o.forEach((i) => {
              n.push({ param: r, value: i, op: 'a' });
            })
          : n.push({ param: r, value: o, op: 'a' });
      }),
      this.clone(n)
    );
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: 's' });
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: 'd' });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((r) => n + '=' + this.encoder.encodeValue(r))
            .join('&');
        })
        .filter((t) => t !== '')
        .join('&')
    );
  }
  clone(t) {
    let n = new e({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case 'a':
            case 's':
              let n = (t.op === 'a' ? this.map.get(t.param) : void 0) || [];
              n.push(ro(t.value)), this.map.set(t.param, n);
              break;
            case 'd':
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  o = r.indexOf(ro(t.value));
                o !== -1 && r.splice(o, 1),
                  r.length > 0
                    ? this.map.set(t.param, r)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Ws = class {
  map = new Map();
  set(t, n) {
    return this.map.set(t, n), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function Dy(e) {
  switch (e) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return !1;
    default:
      return !0;
  }
}
function Wl(e) {
  return typeof ArrayBuffer < 'u' && e instanceof ArrayBuffer;
}
function ql(e) {
  return typeof Blob < 'u' && e instanceof Blob;
}
function Zl(e) {
  return typeof FormData < 'u' && e instanceof FormData;
}
function Ey(e) {
  return typeof URLSearchParams < 'u' && e instanceof URLSearchParams;
}
var mn = class e {
    url;
    body = null;
    headers;
    context;
    reportProgress = !1;
    withCredentials = !1;
    responseType = 'json';
    method;
    params;
    urlWithParams;
    transferCache;
    constructor(t, n, r, o) {
      (this.url = n), (this.method = t.toUpperCase());
      let i;
      if (
        (Dy(this.method) || o
          ? ((this.body = r !== void 0 ? r : null), (i = o))
          : (i = r),
        i &&
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          (this.transferCache = i.transferCache)),
        (this.headers ??= new Pe()),
        (this.context ??= new Ws()),
        !this.params)
      )
        (this.params = new We()), (this.urlWithParams = n);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf('?'),
            u = a === -1 ? '?' : a < n.length - 1 ? '&' : '';
          this.urlWithParams = n + u + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == 'string' ||
          Wl(this.body) ||
          ql(this.body) ||
          Zl(this.body) ||
          Ey(this.body)
        ? this.body
        : this.body instanceof We
        ? this.body.toString()
        : typeof this.body == 'object' ||
          typeof this.body == 'boolean' ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || Zl(this.body)
        ? null
        : ql(this.body)
        ? this.body.type || null
        : Wl(this.body)
        ? null
        : typeof this.body == 'string'
        ? 'text/plain'
        : this.body instanceof We
        ? 'application/x-www-form-urlencoded;charset=UTF-8'
        : typeof this.body == 'object' ||
          typeof this.body == 'number' ||
          typeof this.body == 'boolean'
        ? 'application/json'
        : null;
    }
    clone(t = {}) {
      let n = t.method || this.method,
        r = t.url || this.url,
        o = t.responseType || this.responseType,
        i = t.transferCache ?? this.transferCache,
        s = t.body !== void 0 ? t.body : this.body,
        a = t.withCredentials ?? this.withCredentials,
        u = t.reportProgress ?? this.reportProgress,
        c = t.headers || this.headers,
        l = t.params || this.params,
        d = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (c = Object.keys(t.setHeaders).reduce(
            (h, f) => h.set(f, t.setHeaders[f]),
            c
          )),
        t.setParams &&
          (l = Object.keys(t.setParams).reduce(
            (h, f) => h.set(f, t.setParams[f]),
            l
          )),
        new e(n, r, s, {
          params: l,
          headers: c,
          context: d,
          reportProgress: u,
          responseType: o,
          withCredentials: a,
          transferCache: i,
        })
      );
    }
  },
  qe = (function (e) {
    return (
      (e[(e.Sent = 0)] = 'Sent'),
      (e[(e.UploadProgress = 1)] = 'UploadProgress'),
      (e[(e.ResponseHeader = 2)] = 'ResponseHeader'),
      (e[(e.DownloadProgress = 3)] = 'DownloadProgress'),
      (e[(e.Response = 4)] = 'Response'),
      (e[(e.User = 5)] = 'User'),
      e
    );
  })(qe || {}),
  vn = class {
    headers;
    status;
    statusText;
    url;
    ok;
    type;
    constructor(t, n = 200, r = 'OK') {
      (this.headers = t.headers || new Pe()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  io = class e extends vn {
    constructor(t = {}) {
      super(t);
    }
    type = qe.ResponseHeader;
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  Dn = class e extends vn {
    body;
    constructor(t = {}) {
      super(t), (this.body = t.body !== void 0 ? t.body : null);
    }
    type = qe.Response;
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  ze = class extends vn {
    name = 'HttpErrorResponse';
    message;
    error;
    ok = !1;
    constructor(t) {
      super(t, 0, 'Unknown Error'),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              t.url || '(unknown url)'
            }`)
          : (this.message = `Http failure response for ${
              t.url || '(unknown url)'
            }: ${t.status} ${t.statusText}`),
        (this.error = t.error || null);
    }
  },
  Jl = 200,
  Cy = 204;
function Gs(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    transferCache: e.transferCache,
  };
}
var Ys = (() => {
    class e {
      handler;
      constructor(n) {
        this.handler = n;
      }
      request(n, r, o = {}) {
        let i;
        if (n instanceof mn) i = n;
        else {
          let u;
          o.headers instanceof Pe ? (u = o.headers) : (u = new Pe(o.headers));
          let c;
          o.params &&
            (o.params instanceof We
              ? (c = o.params)
              : (c = new We({ fromObject: o.params }))),
            (i = new mn(n, r, o.body !== void 0 ? o.body : null, {
              headers: u,
              context: o.context,
              params: c,
              reportProgress: o.reportProgress,
              responseType: o.responseType || 'json',
              withCredentials: o.withCredentials,
              transferCache: o.transferCache,
            }));
        }
        let s = Jn(i).pipe(Go((u) => this.handler.handle(u)));
        if (n instanceof mn || o.observe === 'events') return s;
        let a = s.pipe(Uo((u) => u instanceof Dn));
        switch (o.observe || 'body') {
          case 'body':
            switch (i.responseType) {
              case 'arraybuffer':
                return a.pipe(
                  X((u) => {
                    if (u.body !== null && !(u.body instanceof ArrayBuffer))
                      throw new Error('Response is not an ArrayBuffer.');
                    return u.body;
                  })
                );
              case 'blob':
                return a.pipe(
                  X((u) => {
                    if (u.body !== null && !(u.body instanceof Blob))
                      throw new Error('Response is not a Blob.');
                    return u.body;
                  })
                );
              case 'text':
                return a.pipe(
                  X((u) => {
                    if (u.body !== null && typeof u.body != 'string')
                      throw new Error('Response is not a string.');
                    return u.body;
                  })
                );
              case 'json':
              default:
                return a.pipe(X((u) => u.body));
            }
          case 'response':
            return a;
          default:
            throw new Error(
              `Unreachable: unhandled observe type ${o.observe}}`
            );
        }
      }
      delete(n, r = {}) {
        return this.request('DELETE', n, r);
      }
      get(n, r = {}) {
        return this.request('GET', n, r);
      }
      head(n, r = {}) {
        return this.request('HEAD', n, r);
      }
      jsonp(n, r) {
        return this.request('JSONP', n, {
          params: new We().append(r, 'JSONP_CALLBACK'),
          observe: 'body',
          responseType: 'json',
        });
      }
      options(n, r = {}) {
        return this.request('OPTIONS', n, r);
      }
      patch(n, r, o = {}) {
        return this.request('PATCH', n, Gs(o, r));
      }
      post(n, r, o = {}) {
        return this.request('POST', n, Gs(o, r));
      }
      put(n, r, o = {}) {
        return this.request('PUT', n, Gs(o, r));
      }
      static ɵfac = function (r) {
        return new (r || e)(T(yn));
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  _y = /^\)\]\}',?\n/,
  wy = 'X-Request-URL';
function Yl(e) {
  if (e.url) return e.url;
  let t = wy.toLocaleLowerCase();
  return e.headers.get(t);
}
var Iy = (() => {
    class e {
      fetchImpl =
        D(qs, { optional: !0 })?.fetch ?? ((...n) => globalThis.fetch(...n));
      ngZone = D(B);
      handle(n) {
        return new k((r) => {
          let o = new AbortController();
          return (
            this.doRequest(n, o.signal, r).then(Zs, (i) =>
              r.error(new ze({ error: i }))
            ),
            () => o.abort()
          );
        });
      }
      doRequest(n, r, o) {
        return Bt(this, null, function* () {
          let i = this.createRequestInit(n),
            s;
          try {
            let f = this.ngZone.runOutsideAngular(() =>
              this.fetchImpl(n.urlWithParams, O({ signal: r }, i))
            );
            by(f), o.next({ type: qe.Sent }), (s = yield f);
          } catch (f) {
            o.error(
              new ze({
                error: f,
                status: f.status ?? 0,
                statusText: f.statusText,
                url: n.urlWithParams,
                headers: f.headers,
              })
            );
            return;
          }
          let a = new Pe(s.headers),
            u = s.statusText,
            c = Yl(s) ?? n.urlWithParams,
            l = s.status,
            d = null;
          if (
            (n.reportProgress &&
              o.next(new io({ headers: a, status: l, statusText: u, url: c })),
            s.body)
          ) {
            let f = s.headers.get('content-length'),
              p = [],
              g = s.body.getReader(),
              m = 0,
              E,
              F,
              x = typeof Zone < 'u' && Zone.current;
            yield this.ngZone.runOutsideAngular(() =>
              Bt(this, null, function* () {
                for (;;) {
                  let { done: Y, value: V } = yield g.read();
                  if (Y) break;
                  if ((p.push(V), (m += V.length), n.reportProgress)) {
                    F =
                      n.responseType === 'text'
                        ? (F ?? '') +
                          (E ??= new TextDecoder()).decode(V, { stream: !0 })
                        : void 0;
                    let be = () =>
                      o.next({
                        type: qe.DownloadProgress,
                        total: f ? +f : void 0,
                        loaded: m,
                        partialText: F,
                      });
                    x ? x.run(be) : be();
                  }
                }
              })
            );
            let U = this.concatChunks(p, m);
            try {
              let Y = s.headers.get('Content-Type') ?? '';
              d = this.parseBody(n, U, Y);
            } catch (Y) {
              o.error(
                new ze({
                  error: Y,
                  headers: new Pe(s.headers),
                  status: s.status,
                  statusText: s.statusText,
                  url: Yl(s) ?? n.urlWithParams,
                })
              );
              return;
            }
          }
          l === 0 && (l = d ? Jl : 0),
            l >= 200 && l < 300
              ? (o.next(
                  new Dn({
                    body: d,
                    headers: a,
                    status: l,
                    statusText: u,
                    url: c,
                  })
                ),
                o.complete())
              : o.error(
                  new ze({
                    error: d,
                    headers: a,
                    status: l,
                    statusText: u,
                    url: c,
                  })
                );
        });
      }
      parseBody(n, r, o) {
        switch (n.responseType) {
          case 'json':
            let i = new TextDecoder().decode(r).replace(_y, '');
            return i === '' ? null : JSON.parse(i);
          case 'text':
            return new TextDecoder().decode(r);
          case 'blob':
            return new Blob([r], { type: o });
          case 'arraybuffer':
            return r.buffer;
        }
      }
      createRequestInit(n) {
        let r = {},
          o = n.withCredentials ? 'include' : void 0;
        if (
          (n.headers.forEach((i, s) => (r[i] = s.join(','))),
          n.headers.has('Accept') ||
            (r.Accept = 'application/json, text/plain, */*'),
          !n.headers.has('Content-Type'))
        ) {
          let i = n.detectContentTypeHeader();
          i !== null && (r['Content-Type'] = i);
        }
        return {
          body: n.serializeBody(),
          method: n.method,
          headers: r,
          credentials: o,
        };
      }
      concatChunks(n, r) {
        let o = new Uint8Array(r),
          i = 0;
        for (let s of n) o.set(s, i), (i += s.length);
        return o;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  qs = class {};
function Zs() {}
function by(e) {
  e.then(Zs, Zs);
}
function My(e, t) {
  return t(e);
}
function Ty(e, t, n) {
  return (r, o) => Or(n, () => t(r, (i) => e(i, o)));
}
var Xl = new v(''),
  Sy = new v(''),
  Ny = new v('', { providedIn: 'root', factory: () => !0 });
var Ql = (() => {
  class e extends yn {
    backend;
    injector;
    chain = null;
    pendingTasks = D(At);
    contributeToStability = D(Ny);
    constructor(n, r) {
      super(), (this.backend = n), (this.injector = r);
    }
    handle(n) {
      if (this.chain === null) {
        let r = Array.from(
          new Set([...this.injector.get(Xl), ...this.injector.get(Sy, [])])
        );
        this.chain = r.reduceRight((o, i) => Ty(o, i, this.injector), My);
      }
      if (this.contributeToStability) {
        let r = this.pendingTasks.add();
        return this.chain(n, (o) => this.backend.handle(o)).pipe(
          zo(() => this.pendingTasks.remove(r))
        );
      } else return this.chain(n, (r) => this.backend.handle(r));
    }
    static ɵfac = function (r) {
      return new (r || e)(T(oo), T(Te));
    };
    static ɵprov = A({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var xy = /^\)\]\}',?\n/;
function Ay(e) {
  return 'responseURL' in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
    ? e.getResponseHeader('X-Request-URL')
    : null;
}
var Kl = (() => {
    class e {
      xhrFactory;
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === 'JSONP') throw new C(-2800, !1);
        let r = this.xhrFactory;
        return (r.ɵloadImpl ? Je(r.ɵloadImpl()) : Jn(null)).pipe(
          Wo(
            () =>
              new k((i) => {
                let s = r.build();
                if (
                  (s.open(n.method, n.urlWithParams),
                  n.withCredentials && (s.withCredentials = !0),
                  n.headers.forEach((g, m) =>
                    s.setRequestHeader(g, m.join(','))
                  ),
                  n.headers.has('Accept') ||
                    s.setRequestHeader(
                      'Accept',
                      'application/json, text/plain, */*'
                    ),
                  !n.headers.has('Content-Type'))
                ) {
                  let g = n.detectContentTypeHeader();
                  g !== null && s.setRequestHeader('Content-Type', g);
                }
                if (n.responseType) {
                  let g = n.responseType.toLowerCase();
                  s.responseType = g !== 'json' ? g : 'text';
                }
                let a = n.serializeBody(),
                  u = null,
                  c = () => {
                    if (u !== null) return u;
                    let g = s.statusText || 'OK',
                      m = new Pe(s.getAllResponseHeaders()),
                      E = Ay(s) || n.url;
                    return (
                      (u = new io({
                        headers: m,
                        status: s.status,
                        statusText: g,
                        url: E,
                      })),
                      u
                    );
                  },
                  l = () => {
                    let { headers: g, status: m, statusText: E, url: F } = c(),
                      x = null;
                    m !== Cy &&
                      (x =
                        typeof s.response > 'u' ? s.responseText : s.response),
                      m === 0 && (m = x ? Jl : 0);
                    let U = m >= 200 && m < 300;
                    if (n.responseType === 'json' && typeof x == 'string') {
                      let Y = x;
                      x = x.replace(xy, '');
                      try {
                        x = x !== '' ? JSON.parse(x) : null;
                      } catch (V) {
                        (x = Y), U && ((U = !1), (x = { error: V, text: x }));
                      }
                    }
                    U
                      ? (i.next(
                          new Dn({
                            body: x,
                            headers: g,
                            status: m,
                            statusText: E,
                            url: F || void 0,
                          })
                        ),
                        i.complete())
                      : i.error(
                          new ze({
                            error: x,
                            headers: g,
                            status: m,
                            statusText: E,
                            url: F || void 0,
                          })
                        );
                  },
                  d = (g) => {
                    let { url: m } = c(),
                      E = new ze({
                        error: g,
                        status: s.status || 0,
                        statusText: s.statusText || 'Unknown Error',
                        url: m || void 0,
                      });
                    i.error(E);
                  },
                  h = !1,
                  f = (g) => {
                    h || (i.next(c()), (h = !0));
                    let m = { type: qe.DownloadProgress, loaded: g.loaded };
                    g.lengthComputable && (m.total = g.total),
                      n.responseType === 'text' &&
                        s.responseText &&
                        (m.partialText = s.responseText),
                      i.next(m);
                  },
                  p = (g) => {
                    let m = { type: qe.UploadProgress, loaded: g.loaded };
                    g.lengthComputable && (m.total = g.total), i.next(m);
                  };
                return (
                  s.addEventListener('load', l),
                  s.addEventListener('error', d),
                  s.addEventListener('timeout', d),
                  s.addEventListener('abort', d),
                  n.reportProgress &&
                    (s.addEventListener('progress', f),
                    a !== null &&
                      s.upload &&
                      s.upload.addEventListener('progress', p)),
                  s.send(a),
                  i.next({ type: qe.Sent }),
                  () => {
                    s.removeEventListener('error', d),
                      s.removeEventListener('abort', d),
                      s.removeEventListener('load', l),
                      s.removeEventListener('timeout', d),
                      n.reportProgress &&
                        (s.removeEventListener('progress', f),
                        a !== null &&
                          s.upload &&
                          s.upload.removeEventListener('progress', p)),
                      s.readyState !== s.DONE && s.abort();
                  }
                );
              })
          )
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Pt));
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  ed = new v(''),
  Oy = 'XSRF-TOKEN',
  Ry = new v('', { providedIn: 'root', factory: () => Oy }),
  Fy = 'X-XSRF-TOKEN',
  Py = new v('', { providedIn: 'root', factory: () => Fy }),
  so = class {},
  ky = (() => {
    class e {
      doc;
      platform;
      cookieName;
      lastCookieString = '';
      lastToken = null;
      parseCount = 0;
      constructor(n, r, o) {
        (this.doc = n), (this.platform = r), (this.cookieName = o);
      }
      getToken() {
        if (this.platform === 'server') return null;
        let n = this.doc.cookie || '';
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = to(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Ie), T(Ue), T(Ry));
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Ly(e, t) {
  let n = e.url.toLowerCase();
  if (
    !D(ed) ||
    e.method === 'GET' ||
    e.method === 'HEAD' ||
    n.startsWith('http://') ||
    n.startsWith('https://')
  )
    return t(e);
  let r = D(so).getToken(),
    o = D(Py);
  return (
    r != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, r) })),
    t(e)
  );
}
function td(...e) {
  let t = [
    Ys,
    Kl,
    Ql,
    { provide: yn, useExisting: Ql },
    { provide: oo, useFactory: () => D(Iy, { optional: !0 }) ?? D(Kl) },
    { provide: Xl, useValue: Ly, multi: !0 },
    { provide: ed, useValue: !0 },
    { provide: so, useClass: ky },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return ns(t);
}
var Ks = class extends eo {
    supportsDOMEvents = !0;
  },
  Js = class e extends Ks {
    static makeCurrent() {
      Ul(new e());
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === 'window'
        ? window
        : n === 'document'
        ? t
        : n === 'body'
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let n = jy();
      return n == null ? null : By(n);
    }
    resetBaseElement() {
      En = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return to(document.cookie, t);
    }
  },
  En = null;
function jy() {
  return (
    (En = En || document.querySelector('base')),
    En ? En.getAttribute('href') : null
  );
}
function By(e) {
  return new URL(e, document.baseURI).pathname;
}
var Hy = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Xs = new v(''),
  ad = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(n, r) {
        (this._zone = r),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, r, o) {
        return this._findPluginFor(r).addEventListener(n, r, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(n))), !r))
          throw new C(5101, !1);
        return this._eventNameToPlugin.set(n, r), r;
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Xs), T(B));
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  uo = class {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    manager;
  },
  ao = 'ng-app-id';
function nd(e) {
  for (let t of e) t.remove();
}
function rd(e, t) {
  let n = t.createElement('style');
  return (n.textContent = e), n;
}
function $y(e, t, n, r) {
  let o = e.head?.querySelectorAll(`style[${ao}="${t}"],link[${ao}="${t}"]`);
  if (o)
    for (let i of o)
      i.removeAttribute(ao),
        i instanceof HTMLLinkElement
          ? r.set(i.href.slice(i.href.lastIndexOf('/') + 1), {
              usage: 0,
              elements: [i],
            })
          : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] });
}
function ea(e, t) {
  let n = t.createElement('link');
  return n.setAttribute('rel', 'stylesheet'), n.setAttribute('href', e), n;
}
var ud = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      isServer;
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.isServer = no(i)),
          $y(n, r, this.inline, this.external),
          this.hosts.add(n.head);
      }
      addStyles(n, r) {
        for (let o of n) this.addUsage(o, this.inline, rd);
        r?.forEach((o) => this.addUsage(o, this.external, ea));
      }
      removeStyles(n, r) {
        for (let o of n) this.removeUsage(o, this.inline);
        r?.forEach((o) => this.removeUsage(o, this.external));
      }
      addUsage(n, r, o) {
        let i = r.get(n);
        i
          ? i.usage++
          : r.set(n, {
              usage: 1,
              elements: [...this.hosts].map((s) =>
                this.addElement(s, o(n, this.doc))
              ),
            });
      }
      removeUsage(n, r) {
        let o = r.get(n);
        o && (o.usage--, o.usage <= 0 && (nd(o.elements), r.delete(n)));
      }
      ngOnDestroy() {
        for (let [, { elements: n }] of [...this.inline, ...this.external])
          nd(n);
        this.hosts.clear();
      }
      addHost(n) {
        this.hosts.add(n);
        for (let [r, { elements: o }] of this.inline)
          o.push(this.addElement(n, rd(r, this.doc)));
        for (let [r, { elements: o }] of this.external)
          o.push(this.addElement(n, ea(r, this.doc)));
      }
      removeHost(n) {
        this.hosts.delete(n);
      }
      addElement(n, r) {
        return (
          this.nonce && r.setAttribute('nonce', this.nonce),
          this.isServer && r.setAttribute(ao, this.appId),
          n.appendChild(r)
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Ie), T(Ds), T(Cs, 8), T(Ue));
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Qs = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/Math/MathML',
  },
  na = /%COMP%/g,
  cd = '%COMP%',
  Uy = `_nghost-${cd}`,
  Gy = `_ngcontent-${cd}`,
  zy = !0,
  Wy = new v('', { providedIn: 'root', factory: () => zy });
function qy(e) {
  return Gy.replace(na, e);
}
function Zy(e) {
  return Uy.replace(na, e);
}
function ld(e, t) {
  return t.map((n) => n.replace(na, e));
}
var od = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      constructor(n, r, o, i, s, a, u, c = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = u),
          (this.nonce = c),
          (this.platformIsServer = no(a)),
          (this.defaultRenderer = new Cn(n, s, u, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === Ee.ShadowDom &&
          (r = L(O({}, r), { encapsulation: Ee.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof co
            ? o.applyToHost(n)
            : o instanceof _n && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            u = this.eventManager,
            c = this.sharedStylesHost,
            l = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (r.encapsulation) {
            case Ee.Emulated:
              i = new co(u, c, r, this.appId, l, s, a, d);
              break;
            case Ee.ShadowDom:
              return new ta(u, c, n, r, s, a, this.nonce, d);
            default:
              i = new _n(u, c, r, l, s, a, d);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(n) {
        this.rendererByCompId.delete(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          T(ad),
          T(ud),
          T(Ds),
          T(Wy),
          T(Ie),
          T(Ue),
          T(B),
          T(Cs)
        );
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Cn = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(t, n, r, o) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o);
    }
    destroy() {}
    destroyNode = null;
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Qs[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (id(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (id(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == 'string' ? this.doc.querySelector(t) : t;
      if (!r) throw new C(-5104, !1);
      return n || (r.textContent = ''), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ':' + n;
        let i = Qs[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Qs[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (xe.DashCase | xe.Important)
        ? t.style.setProperty(n, r, o & xe.Important ? 'important' : '')
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & xe.DashCase ? t.style.removeProperty(n) : (t.style[n] = '');
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r) {
      if (
        typeof t == 'string' &&
        ((t = kt().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`);
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === '__ngUnwrap__') return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function id(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0;
}
var ta = class extends Cn {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = ld(o.id, o.styles);
      for (let d of c) {
        let h = document.createElement('style');
        a && h.setAttribute('nonce', a),
          (h.textContent = d),
          this.shadowRoot.appendChild(h);
      }
      let l = o.getExternalStyles?.();
      if (l)
        for (let d of l) {
          let h = ea(d, i);
          a && h.setAttribute('nonce', a), this.shadowRoot.appendChild(h);
        }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  _n = class extends Cn {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = u ? ld(u, r.styles) : r.styles),
        (this.styleUrls = r.getExternalStyles?.(u));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  co = class extends _n {
    contentAttr;
    hostAttr;
    constructor(t, n, r, o, i, s, a, u) {
      let c = o + '-' + r.id;
      super(t, n, r, i, s, a, u, c),
        (this.contentAttr = qy(c)),
        (this.hostAttr = Zy(c));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, '');
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ''), r;
    }
  },
  Yy = (() => {
    class e extends uo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, o) {
        return (
          n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o)
        );
      }
      removeEventListener(n, r, o) {
        return n.removeEventListener(r, o);
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Ie));
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  sd = ['alt', 'control', 'meta', 'shift'],
  Qy = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  Ky = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  Jy = (() => {
    class e extends uo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, o) {
        let i = e.parseEventName(r),
          s = e.eventCallback(i.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => kt().onAndCancel(n, i.domEventName, s));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split('.'),
          o = r.shift();
        if (r.length === 0 || !(o === 'keydown' || o === 'keyup')) return null;
        let i = e._normalizeKey(r.pop()),
          s = '',
          a = r.indexOf('code');
        if (
          (a > -1 && (r.splice(a, 1), (s = 'code.')),
          sd.forEach((c) => {
            let l = r.indexOf(c);
            l > -1 && (r.splice(l, 1), (s += c + '.'));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let u = {};
        return (u.domEventName = o), (u.fullKey = s), u;
      }
      static matchEventFullKeyCode(n, r) {
        let o = Qy[n.key] || n.key,
          i = '';
        return (
          r.indexOf('code.') > -1 && ((o = n.code), (i = 'code.')),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === ' ' ? (o = 'space') : o === '.' && (o = 'dot'),
              sd.forEach((s) => {
                if (s !== o) {
                  let a = Ky[s];
                  a(n) && (i += s + '.');
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(n, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(n) {
        return n === 'esc' ? 'escape' : n;
      }
      static ɵfac = function (r) {
        return new (r || e)(T(Ie));
      };
      static ɵprov = A({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function dd(e, t) {
  return Bl(O({ rootComponent: e }, Xy(t)));
}
function Xy(e) {
  return {
    appProviders: [...ov, ...(e?.providers ?? [])],
    platformProviders: rv,
  };
}
function ev() {
  Js.makeCurrent();
}
function tv() {
  return new Be();
}
function nv() {
  return Uc(document), document;
}
var rv = [
  { provide: Ue, useValue: Gl },
  { provide: Es, useValue: ev, multi: !0 },
  { provide: Ie, useFactory: nv, deps: [] },
];
var ov = [
  { provide: Ar, useValue: 'root' },
  { provide: Be, useFactory: tv, deps: [] },
  { provide: Xs, useClass: Yy, multi: !0, deps: [Ie, B, Ue] },
  { provide: Xs, useClass: Jy, multi: !0, deps: [Ie] },
  od,
  ud,
  ad,
  { provide: Tt, useExisting: od },
  { provide: Pt, useClass: Hy, deps: [] },
  [],
];
var Ed = (() => {
    class e {
      _renderer;
      _elementRef;
      onChange = (n) => {};
      onTouched = () => {};
      constructor(n, r) {
        (this._renderer = n), (this._elementRef = r);
      }
      setProperty(n, r) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, r);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty('disabled', n);
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Gr), H(ln));
      };
      static ɵdir = le({ type: e });
    }
    return e;
  })(),
  iv = (() => {
    class e extends Ed {
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = jr(e)))(o || e);
        };
      })();
      static ɵdir = le({ type: e, features: [we] });
    }
    return e;
  })(),
  Cd = new v('');
var sv = { provide: Cd, useExisting: $e(() => Eo), multi: !0 };
function av() {
  let e = kt() ? kt().getUserAgent() : '';
  return /android (\d+)/.test(e.toLowerCase());
}
var uv = new v(''),
  Eo = (() => {
    class e extends Ed {
      _compositionMode;
      _composing = !1;
      constructor(n, r, o) {
        super(n, r),
          (this._compositionMode = o),
          this._compositionMode == null && (this._compositionMode = !av());
      }
      writeValue(n) {
        let r = n ?? '';
        this.setProperty('value', r);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Gr), H(ln), H(uv, 8));
      };
      static ɵdir = le({
        type: e,
        selectors: [
          ['input', 'formControlName', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControlName', ''],
          ['input', 'formControl', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControl', ''],
          ['input', 'ngModel', '', 3, 'type', 'checkbox'],
          ['textarea', 'ngModel', ''],
          ['', 'ngDefaultControl', ''],
        ],
        hostBindings: function (r, o) {
          r & 1 &&
            Ge('input', function (s) {
              return o._handleInput(s.target.value);
            })('blur', function () {
              return o.onTouched();
            })('compositionstart', function () {
              return o._compositionStart();
            })('compositionend', function (s) {
              return o._compositionEnd(s.target.value);
            });
        },
        standalone: !1,
        features: [Ft([sv]), we],
      });
    }
    return e;
  })();
function _d(e) {
  return (
    e == null || ((typeof e == 'string' || Array.isArray(e)) && e.length === 0)
  );
}
function cv(e) {
  return e != null && typeof e.length == 'number';
}
var Co = new v(''),
  wd = new v('');
function lv(e) {
  return _d(e.value) ? { required: !0 } : null;
}
function dv(e) {
  return (t) =>
    _d(t.value) || !cv(t.value)
      ? null
      : t.value.length < e
      ? { minlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function fd(e) {
  return null;
}
function Id(e) {
  return e != null;
}
function bd(e) {
  return hn(e) ? Je(e) : e;
}
function Md(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? O(O({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function Td(e, t) {
  return t.map((n) => n(e));
}
function fv(e) {
  return !e.validate;
}
function Sd(e) {
  return e.map((t) => (fv(t) ? t : (n) => t.validate(n)));
}
function hv(e) {
  if (!e) return null;
  let t = e.filter(Id);
  return t.length == 0
    ? null
    : function (n) {
        return Md(Td(n, t));
      };
}
function Nd(e) {
  return e != null ? hv(Sd(e)) : null;
}
function pv(e) {
  if (!e) return null;
  let t = e.filter(Id);
  return t.length == 0
    ? null
    : function (n) {
        let r = Td(n, t).map(bd);
        return $o(r).pipe(X(Md));
      };
}
function xd(e) {
  return e != null ? pv(Sd(e)) : null;
}
function hd(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function Ad(e) {
  return e._rawValidators;
}
function Od(e) {
  return e._rawAsyncValidators;
}
function ra(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function fo(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function pd(e, t) {
  let n = ra(t);
  return (
    ra(e).forEach((o) => {
      fo(n, o) || n.push(o);
    }),
    n
  );
}
function gd(e, t) {
  return ra(t).filter((n) => !fo(e, n));
}
var ho = class {
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators = [];
    _rawAsyncValidators = [];
    _setValidators(t) {
      (this._rawValidators = t || []),
        (this._composedValidatorFn = Nd(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = xd(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _onDestroyCallbacks = [];
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = []);
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1;
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null;
    }
  },
  jt = class extends ho {
    name;
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  Tn = class extends ho {
    _parent = null;
    name = null;
    valueAccessor = null;
  },
  po = class {
    _cd;
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return this._cd?.control?._touched?.(), !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return this._cd?.control?._status?.(), !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return this._cd?._submitted?.(), !!this._cd?.submitted;
    }
  },
  gv = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  nw = L(O({}, gv), { '[class.ng-submitted]': 'isSubmitted' }),
  Rd = (() => {
    class e extends po {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Tn, 2));
      };
      static ɵdir = le({
        type: e,
        selectors: [
          ['', 'formControlName', ''],
          ['', 'ngModel', ''],
          ['', 'formControl', ''],
        ],
        hostVars: 14,
        hostBindings: function (r, o) {
          r & 2 &&
            Re('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)(
              'ng-pristine',
              o.isPristine
            )('ng-dirty', o.isDirty)('ng-valid', o.isValid)(
              'ng-invalid',
              o.isInvalid
            )('ng-pending', o.isPending);
        },
        standalone: !1,
        features: [we],
      });
    }
    return e;
  })(),
  Fd = (() => {
    class e extends po {
      constructor(n) {
        super(n);
      }
      static ɵfac = function (r) {
        return new (r || e)(H(jt, 10));
      };
      static ɵdir = le({
        type: e,
        selectors: [
          ['', 'formGroupName', ''],
          ['', 'formArrayName', ''],
          ['', 'ngModelGroup', ''],
          ['', 'formGroup', ''],
          ['form', 3, 'ngNoForm', ''],
          ['', 'ngForm', ''],
        ],
        hostVars: 16,
        hostBindings: function (r, o) {
          r & 2 &&
            Re('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)(
              'ng-pristine',
              o.isPristine
            )('ng-dirty', o.isDirty)('ng-valid', o.isValid)(
              'ng-invalid',
              o.isInvalid
            )('ng-pending', o.isPending)('ng-submitted', o.isSubmitted);
        },
        standalone: !1,
        features: [we],
      });
    }
    return e;
  })();
var wn = 'VALID',
  lo = 'INVALID',
  Lt = 'PENDING',
  In = 'DISABLED',
  Ze = class {},
  go = class extends Ze {
    value;
    source;
    constructor(t, n) {
      super(), (this.value = t), (this.source = n);
    }
  },
  bn = class extends Ze {
    pristine;
    source;
    constructor(t, n) {
      super(), (this.pristine = t), (this.source = n);
    }
  },
  Mn = class extends Ze {
    touched;
    source;
    constructor(t, n) {
      super(), (this.touched = t), (this.source = n);
    }
  },
  Vt = class extends Ze {
    status;
    source;
    constructor(t, n) {
      super(), (this.status = t), (this.source = n);
    }
  },
  oa = class extends Ze {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  },
  ia = class extends Ze {
    source;
    constructor(t) {
      super(), (this.source = t);
    }
  };
function Pd(e) {
  return (_o(e) ? e.validators : e) || null;
}
function mv(e) {
  return Array.isArray(e) ? Nd(e) : e || null;
}
function kd(e, t) {
  return (_o(t) ? t.asyncValidators : e) || null;
}
function yv(e) {
  return Array.isArray(e) ? xd(e) : e || null;
}
function _o(e) {
  return e != null && !Array.isArray(e) && typeof e == 'object';
}
function vv(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new C(1e3, '');
  if (!r[n]) throw new C(1001, '');
}
function Dv(e, t, n) {
  e._forEachChild((r, o) => {
    if (n[o] === void 0) throw new C(1002, '');
  });
}
var mo = class {
    _pendingDirty = !1;
    _hasOwnPendingAsyncValidator = null;
    _pendingTouched = !1;
    _onCollectionChange = () => {};
    _updateOn;
    _parent = null;
    _asyncValidationSubscription;
    _composedValidatorFn;
    _composedAsyncValidatorFn;
    _rawValidators;
    _rawAsyncValidators;
    value;
    constructor(t, n) {
      this._assignValidators(t), this._assignAsyncValidators(n);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return Fe(this.statusReactive);
    }
    set status(t) {
      Fe(() => this.statusReactive.set(t));
    }
    _status = pn(() => this.statusReactive());
    statusReactive = dn(void 0);
    get valid() {
      return this.status === wn;
    }
    get invalid() {
      return this.status === lo;
    }
    get pending() {
      return this.status == Lt;
    }
    get disabled() {
      return this.status === In;
    }
    get enabled() {
      return this.status !== In;
    }
    errors;
    get pristine() {
      return Fe(this.pristineReactive);
    }
    set pristine(t) {
      Fe(() => this.pristineReactive.set(t));
    }
    _pristine = pn(() => this.pristineReactive());
    pristineReactive = dn(!0);
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return Fe(this.touchedReactive);
    }
    set touched(t) {
      Fe(() => this.touchedReactive.set(t));
    }
    _touched = pn(() => this.touchedReactive());
    touchedReactive = dn(!1);
    get untouched() {
      return !this.touched;
    }
    _events = new Me();
    events = this._events.asObservable();
    valueChanges;
    statusChanges;
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : 'change';
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(pd(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(pd(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(gd(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(gd(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return fo(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return fo(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      let n = this.touched === !1;
      this.touched = !0;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsTouched(L(O({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new Mn(!0, r));
    }
    markAllAsTouched(t = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: t.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((n) => n.markAllAsTouched(t));
    }
    markAsUntouched(t = {}) {
      let n = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsUntouched({
          onlySelf: !0,
          emitEvent: t.emitEvent,
          sourceControl: r,
        });
      }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
        n && t.emitEvent !== !1 && this._events.next(new Mn(!1, r));
    }
    markAsDirty(t = {}) {
      let n = this.pristine === !0;
      this.pristine = !1;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsDirty(L(O({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new bn(!1, r));
    }
    markAsPristine(t = {}) {
      let n = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsPristine({ onlySelf: !0, emitEvent: t.emitEvent });
      }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
        n && t.emitEvent !== !1 && this._events.next(new bn(!0, r));
    }
    markAsPending(t = {}) {
      this.status = Lt;
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new Vt(this.status, n)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(L(O({}, t), { sourceControl: n }));
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = In),
        (this.errors = null),
        this._forEachChild((o) => {
          o.disable(L(O({}, t), { onlySelf: !0 }));
        }),
        this._updateValue();
      let r = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new go(this.value, r)),
        this._events.next(new Vt(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(L(O({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((o) => o(!0));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = wn),
        this._forEachChild((r) => {
          r.enable(L(O({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(L(O({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((r) => r(!1));
    }
    _updateAncestors(t, n) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, n),
        this._parent._updateTouched({}, n));
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let r = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === wn || this.status === Lt) &&
            this._runAsyncValidator(r, t.emitEvent);
      }
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new go(this.value, n)),
        this._events.next(new Vt(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(
            L(O({}, t), { sourceControl: n })
          );
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      this._forEachChild((n) => n._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? In : wn;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t, n) {
      if (this.asyncValidator) {
        (this.status = Lt),
          (this._hasOwnPendingAsyncValidator = { emitEvent: n !== !1 });
        let r = bd(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((o) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(o, { emitEvent: n, shouldHaveEmitted: t });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let t = this._hasOwnPendingAsyncValidator?.emitEvent ?? !1;
        return (this._hasOwnPendingAsyncValidator = null), t;
      }
      return !1;
    }
    setErrors(t, n = {}) {
      (this.errors = t),
        this._updateControlsErrors(
          n.emitEvent !== !1,
          this,
          n.shouldHaveEmitted
        );
    }
    get(t) {
      let n = t;
      return n == null ||
        (Array.isArray(n) || (n = n.split('.')), n.length === 0)
        ? null
        : n.reduce((r, o) => r && r._find(o), this);
    }
    getError(t, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[t] : null;
    }
    hasError(t, n) {
      return !!this.getError(t, n);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t, n, r) {
      (this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        (t || r) && this._events.next(new Vt(this.status, n)),
        this._parent && this._parent._updateControlsErrors(t, n, r);
    }
    _initObservables() {
      (this.valueChanges = new te()), (this.statusChanges = new te());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? In
        : this.errors
        ? lo
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Lt)
        ? Lt
        : this._anyControlsHaveStatus(lo)
        ? lo
        : wn;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((n) => n.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t, n) {
      let r = !this._anyControlsDirty(),
        o = this.pristine !== r;
      (this.pristine = r),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
        o && this._events.next(new bn(this.pristine, n));
    }
    _updateTouched(t = {}, n) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new Mn(this.touched, n)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, n);
    }
    _onDisabledChange = [];
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      _o(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let n = this._parent && this._parent.dirty;
      return !t && !!n && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      (this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = mv(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = yv(this._rawAsyncValidators));
    }
  },
  yo = class extends mo {
    constructor(t, n, r) {
      super(Pd(n), kd(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    controls;
    registerControl(t, n) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(t, n, r = {}) {
      this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(t, n = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    setControl(t, n, r = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        n && this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, n = {}) {
      Dv(this, !0, t),
        Object.keys(t).forEach((r) => {
          vv(this, !0, r),
            this.controls[r].setValue(t[r], {
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (Object.keys(t).forEach((r) => {
          let o = this.controls[r];
          o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = {}, n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t ? t[o] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (t, n, r) => ((t[r] = n.getRawValue()), t)
      );
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (n, r) =>
        r._syncPendingControls() ? !0 : n
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && t(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        t.setParent(this),
          t._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [n, r] of Object.entries(this.controls))
        if (this.contains(n) && t(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
      );
    }
    _reduceChildren(t, n) {
      let r = t;
      return (
        this._forEachChild((o, i) => {
          r = n(r, o, i);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls))
        if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var Ld = new v('CallSetDisabledState', {
    providedIn: 'root',
    factory: () => sa,
  }),
  sa = 'always';
function Ev(e, t) {
  return [...t.path, e];
}
function md(e, t, n = sa) {
  aa(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === 'always') &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    _v(e, t),
    Iv(e, t),
    wv(e, t),
    Cv(e, t);
}
function yd(e, t, n = !0) {
  let r = () => {};
  t.valueAccessor &&
    (t.valueAccessor.registerOnChange(r), t.valueAccessor.registerOnTouched(r)),
    Do(e, t),
    e &&
      (t._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {}));
}
function vo(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t);
  });
}
function Cv(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r);
    };
    e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n);
      });
  }
}
function aa(e, t) {
  let n = Ad(e);
  t.validator !== null
    ? e.setValidators(hd(n, t.validator))
    : typeof n == 'function' && e.setValidators([n]);
  let r = Od(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(hd(r, t.asyncValidator))
    : typeof r == 'function' && e.setAsyncValidators([r]);
  let o = () => e.updateValueAndValidity();
  vo(t._rawValidators, o), vo(t._rawAsyncValidators, o);
}
function Do(e, t) {
  let n = !1;
  if (e !== null) {
    if (t.validator !== null) {
      let o = Ad(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.validator);
        i.length !== o.length && ((n = !0), e.setValidators(i));
      }
    }
    if (t.asyncValidator !== null) {
      let o = Od(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.asyncValidator);
        i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
      }
    }
  }
  let r = () => {};
  return vo(t._rawValidators, r), vo(t._rawAsyncValidators, r), n;
}
function _v(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    (e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === 'change' && Vd(e, t);
  });
}
function wv(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    (e._pendingTouched = !0),
      e.updateOn === 'blur' && e._pendingChange && Vd(e, t),
      e.updateOn !== 'submit' && e.markAsTouched();
  });
}
function Vd(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1);
}
function Iv(e, t) {
  let n = (r, o) => {
    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
  };
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    });
}
function bv(e, t) {
  e == null, aa(e, t);
}
function Mv(e, t) {
  return Do(e, t);
}
function Tv(e, t) {
  if (!e.hasOwnProperty('model')) return !1;
  let n = e.model;
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue);
}
function Sv(e) {
  return Object.getPrototypeOf(e.constructor) === iv;
}
function Nv(e, t) {
  e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === 'submit' &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    });
}
function xv(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let n, r, o;
  return (
    t.forEach((i) => {
      i.constructor === Eo ? (n = i) : Sv(i) ? (r = i) : (o = i);
    }),
    o || r || n || null
  );
}
function Av(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function vd(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Dd(e) {
  return (
    typeof e == 'object' &&
    e !== null &&
    Object.keys(e).length === 2 &&
    'value' in e &&
    'disabled' in e
  );
}
var Sn = class extends mo {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = !1;
  constructor(t = null, n, r) {
    super(Pd(n), kd(r, n)),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      _o(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (Dd(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
  }
  setValue(t, n = {}) {
    (this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) =>
          r(this.value, n.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(n);
  }
  patchValue(t, n = {}) {
    this.setValue(t, n);
  }
  reset(t = this.defaultValue, n = {}) {
    this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    vd(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    vd(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(t) {
    Dd(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var Ov = (e) => e instanceof Sn;
var jd = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵdir = le({
      type: e,
      selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
      hostAttrs: ['novalidate', ''],
      standalone: !1,
    });
  }
  return e;
})();
var Bd = new v('');
var Rv = { provide: jt, useExisting: $e(() => ua) },
  ua = (() => {
    class e extends jt {
      callSetDisabledState;
      get submitted() {
        return Fe(this._submittedReactive);
      }
      set submitted(n) {
        this._submittedReactive.set(n);
      }
      _submitted = pn(() => this._submittedReactive());
      _submittedReactive = dn(!1);
      _oldForm;
      _onCollectionChange = () => this._updateDomValue();
      directives = [];
      form = null;
      ngSubmit = new te();
      constructor(n, r, o) {
        super(),
          (this.callSetDisabledState = o),
          this._setValidators(n),
          this._setAsyncValidators(r);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty('form') &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Do(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let r = this.form.get(n.path);
        return (
          md(r, n, this.callSetDisabledState),
          r.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          r
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        yd(n.control || null, n, !1), Av(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        this.form.get(n.path).setValue(r);
      }
      onSubmit(n) {
        return (
          this._submittedReactive.set(!0),
          Nv(this.form, this.directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new oa(this.control)),
          n?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n),
          this._submittedReactive.set(!1),
          this.form._events.next(new ia(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let r = n.control,
            o = this.form.get(n.path);
          r !== o &&
            (yd(r || null, n),
            Ov(o) && (md(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let r = this.form.get(n.path);
        bv(r, n), r.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let r = this.form.get(n.path);
          r && Mv(r, n) && r.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        aa(this.form, this), this._oldForm && Do(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
      static ɵfac = function (r) {
        return new (r || e)(H(Co, 10), H(wd, 10), H(Ld, 8));
      };
      static ɵdir = le({
        type: e,
        selectors: [['', 'formGroup', '']],
        hostBindings: function (r, o) {
          r & 1 &&
            Ge('submit', function (s) {
              return o.onSubmit(s);
            })('reset', function () {
              return o.onReset();
            });
        },
        inputs: { form: [0, 'formGroup', 'form'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        standalone: !1,
        features: [Ft([Rv]), we, Fr],
      });
    }
    return e;
  })();
var Fv = { provide: Tn, useExisting: $e(() => ca) },
  ca = (() => {
    class e extends Tn {
      _ngModelWarningConfig;
      _added = !1;
      viewModel;
      control;
      name = null;
      set isDisabled(n) {}
      model;
      update = new te();
      static _ngModelWarningSentOnce = !1;
      _ngModelWarningSent = !1;
      constructor(n, r, o, i, s) {
        super(),
          (this._ngModelWarningConfig = s),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o),
          (this.valueAccessor = xv(this, i));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          Tv(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return Ev(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          H(jt, 13),
          H(Co, 10),
          H(wd, 10),
          H(Cd, 10),
          H(Bd, 8)
        );
      };
      static ɵdir = le({
        type: e,
        selectors: [['', 'formControlName', '']],
        inputs: {
          name: [0, 'formControlName', 'name'],
          isDisabled: [0, 'disabled', 'isDisabled'],
          model: [0, 'ngModel', 'model'],
        },
        outputs: { update: 'ngModelChange' },
        standalone: !1,
        features: [Ft([Fv]), we, Fr],
      });
    }
    return e;
  })();
function Pv(e) {
  return typeof e == 'number' ? e : parseInt(e, 10);
}
var Hd = (() => {
  class e {
    _validator = fd;
    _onChange;
    _enabled;
    ngOnChanges(n) {
      if (this.inputName in n) {
        let r = this.normalizeInput(n[this.inputName].currentValue);
        (this._enabled = this.enabled(r)),
          (this._validator = this._enabled ? this.createValidator(r) : fd),
          this._onChange && this._onChange();
      }
    }
    validate(n) {
      return this._validator(n);
    }
    registerOnValidatorChange(n) {
      this._onChange = n;
    }
    enabled(n) {
      return n != null;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵdir = le({ type: e, features: [Fr] });
  }
  return e;
})();
var kv = { provide: Co, useExisting: $e(() => la), multi: !0 };
var la = (() => {
  class e extends Hd {
    required;
    inputName = 'required';
    normalizeInput = Us;
    createValidator = (n) => lv;
    enabled(n) {
      return n;
    }
    static ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = jr(e)))(o || e);
      };
    })();
    static ɵdir = le({
      type: e,
      selectors: [
        ['', 'required', '', 'formControlName', '', 3, 'type', 'checkbox'],
        ['', 'required', '', 'formControl', '', 3, 'type', 'checkbox'],
        ['', 'required', '', 'ngModel', '', 3, 'type', 'checkbox'],
      ],
      hostVars: 1,
      hostBindings: function (r, o) {
        r & 2 && Wr('required', o._enabled ? '' : null);
      },
      inputs: { required: 'required' },
      standalone: !1,
      features: [Ft([kv]), we],
    });
  }
  return e;
})();
var Lv = { provide: Co, useExisting: $e(() => da), multi: !0 },
  da = (() => {
    class e extends Hd {
      minlength;
      inputName = 'minlength';
      normalizeInput = (n) => Pv(n);
      createValidator = (n) => dv(n);
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = jr(e)))(o || e);
        };
      })();
      static ɵdir = le({
        type: e,
        selectors: [
          ['', 'minlength', '', 'formControlName', ''],
          ['', 'minlength', '', 'formControl', ''],
          ['', 'minlength', '', 'ngModel', ''],
        ],
        hostVars: 1,
        hostBindings: function (r, o) {
          r & 2 && Wr('minlength', o._enabled ? o.minlength : null);
        },
        inputs: { minlength: 'minlength' },
        standalone: !1,
        features: [Ft([Lv]), we],
      });
    }
    return e;
  })();
var Vv = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = fn({ type: e });
    static ɵinj = sn({});
  }
  return e;
})();
var $d = (() => {
  class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [
          { provide: Bd, useValue: n.warnOnNgModelWithFormControl ?? 'always' },
          { provide: Ld, useValue: n.callSetDisabledState ?? sa },
        ],
      };
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = fn({ type: e });
    static ɵinj = sn({ imports: [Vv] });
  }
  return e;
})();
var Bv = (e, t) => t.title,
  Hv = () => [
    '\u043D\u0430 1 \u0441\u0443\u0442\u043A\u0438',
    '\u043D\u0430 1-3 \u0441\u0443\u0442\u043E\u043A',
    '\u043D\u0430 3+ \u0441\u0443\u0442\u043E\u043A',
  ];
function $v(e, t) {
  if (e & 1) {
    let n = Qr();
    S(0, 'li', 32),
      Ge('click', function () {
        let o = Lr(n).$implicit,
          i = Kr(),
          s = Ll(31);
        return Vr(i.changeFilter(o, s));
      }),
      $(1),
      N();
  }
  if (e & 2) {
    let n = t.$implicit;
    Re('active', n.active), W(), Rt(' ', n.name, ' ');
  }
}
function Uv(e, t) {
  e & 1 && (S(0, 'span'), $(1, '/\u0441\u0443\u0442'), N());
}
function Gv(e, t) {
  if (
    (e & 1 &&
      (S(0, 'li')(1, 'div', 37),
      $(2),
      N(),
      S(3, 'div', 38),
      $(4),
      Bs(5, Uv, 2, 0, 'span'),
      N()()),
    e & 2)
  ) {
    let n = t.$implicit,
      r = t.$index,
      o = Kr().$implicit;
    W(2), Xr(n), W(2), Rt(' ', o.prices[r], ' $ '), W(), Pl(r > 0 ? 5 : -1);
  }
}
function zv(e, t) {
  if (e & 1) {
    let n = Qr();
    S(0, 'article', 20),
      me(1, 'img', 33),
      S(2, 'div', 34)(3, 'h4'),
      $(4),
      N(),
      S(5, 'p'),
      $(6),
      N(),
      S(7, 'div', 35)(8, 'ul'),
      Zr(9, Gv, 6, 3, 'li', null, Hs),
      N(),
      S(11, 'a', 36),
      Ge('click', function () {
        let o,
          i = Lr(n).$implicit,
          s = Kr();
        return Vr(
          (o = s.orderForm.get('car')) == null ? null : o.setValue(i.title)
        );
      }),
      $(
        12,
        '\u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C'
      ),
      N()()()();
  }
  if (e & 2) {
    let n = t.$implicit;
    W(),
      Jr('src', n.image, Yc),
      Jr('alt', n.title),
      W(3),
      Xr(n.title),
      W(2),
      Rt(' ', n.text, ' '),
      W(3),
      Yr(jl(4, Hv));
  }
}
var Ud = (() => {
  class e {
    constructor() {
      (this.http = D(Ys)),
        (this.cars = []),
        (this.baseCars = [
          {
            image: 'https://testologia.ru/cars-images/1.png',
            title: 'BMW M4 Competition',
            text: '\u0418\u0434\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0431\u0430\u043B\u0430\u043D\u0441 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 \u0438 \u0441\u0442\u0438\u043B\u044F. BMW M4 Competition \u2014 510 \u043B.\u0441. \u0438 \u0434\u0440\u0430\u0439\u0432, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0439 \u0434\u043B\u044F \u043F\u043E\u043A\u043E\u0440\u0435\u043D\u0438\u044F \u0442\u0440\u0430\u0441\u0441 \u0438 \u0433\u043E\u0440\u043E\u0434\u0441\u043A\u0438\u0445 \u0443\u043B\u0438\u0446.',
            prices: [1450, 1300, 1100],
          },
          {
            image: 'https://testologia.ru/cars-images/2.png',
            title: 'BMW M5',
            text: '\u0411\u0438\u0437\u043D\u0435\u0441-\u043A\u043B\u0430\u0441\u0441 \u0441 \u0434\u0443\u0448\u043E\u0439 \u0433\u043E\u043D\u0449\u0438\u043A\u0430. BMW M5: 600 \u043B.\u0441., \u0438\u043D\u0442\u0435\u043B\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u043E\u043B\u043D\u044B\u0439 \u043F\u0440\u0438\u0432\u043E\u0434 \u0438 \u043A\u043E\u043C\u0444\u043E\u0440\u0442 \u0434\u043B\u044F \u0441\u0430\u043C\u044B\u0445 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0445.',
            prices: [1600, 1450, 1250],
          },
          {
            image: 'https://testologia.ru/cars-images/3.png',
            title: 'Lamborghini Huracan Spyder Green',
            text: '\u0412\u043E\u043F\u043B\u043E\u0449\u0435\u043D\u0438\u0435 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 \u0438 \u0441\u0442\u0440\u0430\u0441\u0442\u0438. \u0417\u0435\u043B\u0435\u043D\u044B\u0439 Lamborghini Huracan Spyder \u2014 \u043C\u043E\u0449\u044C 640 \u043B.\u0441. \u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0439 \u0432\u0435\u0440\u0445 \u0434\u043B\u044F \u044F\u0440\u043A\u0438\u0445 \u043F\u0440\u0438\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0439.',
            prices: [3200, 2900, 2600],
          },
          {
            image: 'https://testologia.ru/cars-images/4.png',
            title: 'Ferrari F8 Spider',
            text: '\u041C\u0435\u0447\u0442\u0430 \u043D\u0430 \u043A\u043E\u043B\u0435\u0441\u0430\u0445. Ferrari F8 Spider: 720 \u043B.\u0441., \u0430\u044D\u0440\u043E\u0434\u0438\u043D\u0430\u043C\u0438\u043A\u0430 F1 \u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0430\u044F \u043A\u0430\u0431\u0438\u043D\u0430 \u0434\u043B\u044F \u0442\u0435\u0445, \u043A\u0442\u043E \u0436\u0438\u0432\u0435\u0442 \u043D\u0430 \u043F\u043E\u043B\u043D\u043E\u0439 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438.',
            prices: [3500, 3200, 2900],
          },
          {
            image: 'https://testologia.ru/cars-images/5.png',
            title: 'Porsche 911 Targa 4S Yellow',
            text: '\u042D\u043B\u0435\u0433\u0430\u043D\u0442\u043D\u0430\u044F \u043C\u043E\u0449\u044C \u0432 \u044F\u0440\u043A\u043E\u043C \u0446\u0432\u0435\u0442\u0435. Porsche 911 Targa 4S: \u043F\u043E\u043B\u043D\u044B\u0439 \u043F\u0440\u0438\u0432\u043E\u0434, 450 \u043B.\u0441. \u0438 \u0443\u043D\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C Targa.',
            prices: [1800, 1650, 1450],
          },
          {
            image: 'https://testologia.ru/cars-images/6.png',
            title: 'Mercedes SL 55 AMG',
            text: '\u041A\u043B\u0430\u0441\u0441\u0438\u043A\u0430 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0448\u0438\u043A\u0430. Mercedes SL 55 AMG: \u0440\u043E\u0441\u043A\u043E\u0448\u044C, \u043A\u0430\u0431\u0440\u0438\u043E\u043B\u0435\u0442 \u0438 \u043C\u043E\u0449\u044C 469 \u043B.\u0441. \u0434\u043B\u044F \u043D\u0435\u0437\u0430\u0431\u044B\u0432\u0430\u0435\u043C\u044B\u0445 \u043F\u043E\u0435\u0437\u0434\u043E\u043A.',
            prices: [1700, 1550, 1350],
          },
          {
            image: 'https://testologia.ru/cars-images/7.png',
            title: 'BMW Z4',
            text: '\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u043A\u0430\u0431\u0440\u0438\u043E\u043B\u0435\u0442 \u0434\u043B\u044F \u0441\u0442\u0438\u043B\u044C\u043D\u044B\u0445 \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0439. BMW Z4: \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043E\u044E\u0437 \u043C\u0430\u043D\u0435\u0432\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u0438, \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u0438 \u0438 \u044D\u043B\u0435\u0433\u0430\u043D\u0442\u043D\u043E\u0433\u043E \u0434\u0438\u0437\u0430\u0439\u043D\u0430.',
            prices: [1200, 1100, 950],
          },
          {
            image: 'https://testologia.ru/cars-images/8.png',
            title: 'Mercedes C180 Convertible',
            text: '\u0418\u0434\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0432\u044B\u0431\u043E\u0440 \u0434\u043B\u044F \u0441\u043E\u043B\u043D\u0435\u0447\u043D\u043E\u0433\u043E \u0434\u043D\u044F. Mercedes C180 Convertible: \u043A\u0430\u0431\u0440\u0438\u043E\u043B\u0435\u0442 \u0434\u043B\u044F \u043B\u0435\u0433\u043A\u043E\u0433\u043E \u0438 \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E\u0433\u043E \u0432\u043E\u0436\u0434\u0435\u043D\u0438\u044F.',
            prices: [1e3, 900, 800],
          },
          {
            image: 'https://testologia.ru/cars-images/9.png',
            title: 'Chevrolet Corvette Orange',
            text: '\u042F\u0440\u043A\u0438\u0439, \u043C\u043E\u0449\u043D\u044B\u0439, \u043D\u0435\u0437\u0430\u0431\u044B\u0432\u0430\u0435\u043C\u044B\u0439. Chevrolet Corvette \u0432 \u043E\u0440\u0430\u043D\u0436\u0435\u0432\u043E\u043C \u0446\u0432\u0435\u0442\u0435: 495 \u043B.\u0441. \u0438 \u0441\u0442\u0438\u043B\u044C, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u0441\u0430\u043C \u0437\u0430 \u0441\u0435\u0431\u044F.',
            prices: [1400, 1250, 1100],
          },
          {
            image: 'https://testologia.ru/cars-images/10.png',
            title: 'Audi R8 Blue',
            text: '\u0421\u0443\u043F\u0435\u0440\u043A\u0430\u0440, \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0439 \u0434\u043B\u044F \u0432\u043B\u044E\u0431\u043B\u0435\u043D\u043D\u044B\u0445 \u0432 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u044C. Audi R8 Blue: \u043F\u043E\u043B\u043D\u044B\u0439 \u043F\u0440\u0438\u0432\u043E\u0434, 570 \u043B.\u0441. \u0438 \u043F\u043E\u0442\u0440\u044F\u0441\u0430\u044E\u0449\u0438\u0439 \u0434\u0438\u0437\u0430\u0439\u043D.',
            prices: [2e3, 1850, 1600],
          },
          {
            image: 'https://testologia.ru/cars-images/11.png',
            title: 'Chevrolet Corvette White',
            text: '\u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043C\u043E\u0449\u044C \u0432 \u0438\u0437\u044B\u0441\u043A\u0430\u043D\u043D\u043E\u043C \u0446\u0432\u0435\u0442\u0435. Chevrolet Corvette White: \u043C\u043E\u0449\u043D\u043E\u0441\u0442\u044C, \u0434\u0438\u043D\u0430\u043C\u0438\u043A\u0430 \u0438 \u0441\u0442\u0438\u043B\u044C \u0434\u043B\u044F \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0438\u0445 \u0446\u0435\u043D\u0438\u0442\u0435\u043B\u0435\u0439.',
            prices: [1350, 1200, 1e3],
          },
          {
            image: 'https://testologia.ru/cars-images/12.png',
            title: 'Ford Mustang Convertible Black',
            text: '\u041B\u0435\u0433\u0435\u043D\u0434\u0430 \u0432 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u043C \u0444\u043E\u0440\u043C\u0430\u0442\u0435. Ford Mustang Convertible Black: 450 \u043B.\u0441., \u043A\u0443\u043B\u044C\u0442\u043E\u0432\u044B\u0439 \u0441\u0442\u0438\u043B\u044C \u0438 \u0441\u0432\u043E\u0431\u043E\u0434\u0430 \u043F\u043E\u0434 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u043C \u043D\u0435\u0431\u043E\u043C.',
            prices: [1250, 1150, 1e3],
          },
        ]),
        (this.carsFilter = [
          {
            active: !0,
            name: '\u0412\u0441\u0435 \u043C\u0430\u0440\u043A\u0438',
          },
          { active: !1, name: 'Lamborghini' },
          { active: !1, name: 'Ferrari' },
          { active: !1, name: 'Porsche' },
          { active: !1, name: 'BMW' },
          { active: !1, name: 'Mercedes' },
          { active: !1, name: 'Chevrolet' },
          { active: !1, name: 'Audi' },
          { active: !1, name: 'Ford' },
        ]),
        (this.orderForm = new yo({
          car: new Sn(''),
          name: new Sn(''),
          phone: new Sn(''),
        }));
    }
    ngOnInit() {
      this.getCars('');
    }
    getCars(n) {
      this.http
        .get('https://testologia.ru/cars-data', { params: { filter: n } })
        .subscribe((r) => (this.cars = r));
    }
    changeFilter(n, r) {
      this.carsFilter.forEach((o) => (o.active = !1)),
        (n.active = !0),
        this.getCars(n.name),
        r.scrollIntoView({ behavior: 'instant' });
    }
    isError(n) {
      let r = this.orderForm.get(n);
      return !!(r?.invalid && (r?.dirty || r?.touched));
    }
    sendOrder() {
      this.orderForm.valid &&
        this.http
          .post('https://testologia.ru/cars-order', this.orderForm.value)
          .subscribe({
            next: (n) => {
              alert(n.message), this.orderForm.reset();
            },
            error: (n) => {
              alert(n.error.message);
            },
          });
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵcmp = zr({
        type: e,
        selectors: [['app-cars']],
        decls: 59,
        vars: 8,
        consts: [
          ['carsContent', ''],
          [1, 'main'],
          [1, 'header'],
          [1, 'container'],
          [1, 'logo'],
          ['src', 'img/logo.png', 'alt', ''],
          [1, 'menu'],
          ['href', '#cars'],
          ['href', '#order'],
          ['href', 'tel:+971523898989', 1, 'phone'],
          [1, 'main-content'],
          [1, 'main-info'],
          ['href', '#cars', 'id', 'main-action-button', 1, 'button'],
          [
            'src',
            'img/main-car.png',
            'alt',
            'Car Lamborghini',
            1,
            'main-image',
          ],
          [1, 'black-block'],
          ['id', 'cars', 1, 'cars'],
          ['id', 'cars-content', 1, 'cars-content'],
          [1, 'cars-filter'],
          [3, 'active'],
          [1, 'cars-items'],
          [1, 'car'],
          ['id', 'order', 1, 'order'],
          ['src', 'img/order-car.png', 'alt', 'Order car'],
          [3, 'formGroup'],
          [1, 'order-form'],
          [
            'type',
            'text',
            'placeholder',
            '\u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C',
            'required',
            '',
            'readonly',
            '',
            'id',
            'car',
            'formControlName',
            'car',
          ],
          [
            'type',
            'text',
            'placeholder',
            '\u0412\u0430\u0448\u0435 \u0438\u043C\u044F',
            'required',
            '',
            'id',
            'name',
            'formControlName',
            'name',
          ],
          [
            'type',
            'text',
            'placeholder',
            '\u0412\u0430\u0448 \u0442\u0435\u043B\u0435\u0444\u043E\u043D',
            'required',
            '',
            'id',
            'phone',
            'minlength',
            '10',
            'formControlName',
            'phone',
          ],
          [
            'type',
            'button',
            'id',
            'order-action',
            1,
            'button',
            3,
            'click',
            'disabled',
          ],
          [1, 'footer'],
          ['src', 'img/logo.png', 'alt', 'Logo'],
          [1, 'rights'],
          [3, 'click'],
          [3, 'src', 'alt'],
          [1, 'car-details'],
          [1, 'car-action'],
          ['href', '#order', 1, 'button', 'white-button', 3, 'click'],
          [1, 'car-period'],
          [1, 'car-price'],
        ],
        template: function (r, o) {
          if (r & 1) {
            let i = Qr();
            S(0, 'main', 1)(1, 'header', 2)(2, 'div', 3)(3, 'div', 4),
              me(4, 'img', 5),
              N(),
              S(5, 'nav', 6)(6, 'ul')(7, 'li')(8, 'a', 7),
              $(
                9,
                '\u041D\u0410\u0428 \u0430\u0432\u0442\u043E\u043F\u0430\u0440\u043A'
              ),
              N()(),
              S(10, 'li')(11, 'a', 8),
              $(
                12,
                '\u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C'
              ),
              N()()()(),
              S(13, 'a', 9),
              $(14, '+971 52 389 89 89'),
              N()()(),
              S(15, 'section', 10)(16, 'div', 3)(17, 'div', 11)(18, 'h1'),
              $(
                19,
                '\u041F\u043E\u043A\u043E\u0440\u0438\u0442\u0435 \u0434\u043E\u0440\u043E\u0433\u0438 \u0437\u0430 \u0440\u0443\u043B\u0451\u043C \u043B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0445 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u0435\u0439!'
              ),
              N(),
              S(20, 'p'),
              $(
                21,
                ' \u041E\u0442 \u044D\u043A\u0441\u043A\u043B\u044E\u0437\u0438\u0432\u043D\u044B\u0445 \u0441\u043F\u043E\u0440\u0442\u043A\u0430\u0440\u043E\u0432 \u0434\u043E \u0433\u043E\u043D\u043E\u0447\u043D\u044B\u0445 \u0448\u0435\u0434\u0435\u0432\u0440\u043E\u0432 \u2014 \u0432\u044B\u0431\u0438\u0440\u0430\u0439\u0442\u0435 \u043C\u0435\u0447\u0442\u0443, \u0441\u0430\u0434\u0438\u0442\u0435\u0441\u044C \u0437\u0430 \u0440\u0443\u043B\u044C \u0438 \u043E\u0449\u0443\u0442\u0438\u0442\u0435 \u043C\u043E\u0449\u044C \u043F\u0440\u0435\u043C\u0438\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0430\u0432\u0442\u043E \u043D\u0430 \u043F\u043E\u043B\u043D\u0443\u044E! '
              ),
              N(),
              S(22, 'a', 12),
              $(
                23,
                '\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u0438'
              ),
              N()(),
              me(24, 'img', 13),
              N()(),
              me(25, 'div', 14),
              N(),
              S(26, 'section', 15)(27, 'div', 3)(28, 'h2'),
              $(
                29,
                '\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C'
              ),
              N(),
              S(30, 'div', 16, 0)(32, 'aside', 17)(33, 'ul'),
              Zr(34, $v, 2, 3, 'li', 18, Hs),
              N()(),
              S(36, 'div', 19),
              Zr(37, zv, 13, 5, 'article', 20, Bv),
              N()()()(),
              S(39, 'section', 21)(40, 'div', 3),
              me(41, 'img', 22),
              S(42, 'form', 23)(43, 'h3'),
              $(
                44,
                '\u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u0443\u0439\u0442\u0435 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C'
              ),
              N(),
              S(45, 'p'),
              $(
                46,
                ' \u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435, \u0438 \u043C\u044B \u043F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u043C \u0432\u0430\u043C \u0434\u043B\u044F \u043E\u0431\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u044F \u0434\u0435\u0442\u0430\u043B\u0435\u0439 \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F '
              ),
              N(),
              S(47, 'div', 24),
              me(48, 'input', 25)(49, 'input', 26)(50, 'input', 27),
              S(51, 'button', 28),
              Ge('click', function () {
                return Lr(i), Vr(o.sendOrder());
              }),
              $(
                52,
                ' \u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C '
              ),
              N()()()()(),
              S(53, 'footer', 29)(54, 'div', 3)(55, 'div', 4),
              me(56, 'img', 30),
              N(),
              S(57, 'div', 31),
              $(
                58,
                '\xA9 \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B'
              ),
              N()()();
          }
          r & 2 &&
            (W(34),
            Yr(o.carsFilter),
            W(3),
            Yr(o.cars),
            W(5),
            qr('formGroup', o.orderForm),
            W(6),
            Re('error', o.isError('car')),
            W(),
            Re('error', o.isError('name')),
            W(),
            Re('error', o.isError('phone')),
            W(),
            qr('disabled', !o.orderForm.valid));
        },
        dependencies: [$d, jd, Eo, Rd, Fd, la, da, ua, ca],
        styles: [
          '.container[_ngcontent-%COMP%]{max-width:1200px;margin:0 auto}.button[_ngcontent-%COMP%]{width:344px;height:69px;padding:20px;text-align:center;box-sizing:border-box;background-color:#f8ff23;color:#000;outline:0;text-decoration:none;display:block;border:0;cursor:pointer;font-size:24px}.button[_ngcontent-%COMP%]:hover:not(:disabled){background-color:#fff}.button[_ngcontent-%COMP%]:disabled{cursor:not-allowed;color:gray;background-color:#343434}.button.white-button[_ngcontent-%COMP%]{background-color:#fff}.button.white-button[_ngcontent-%COMP%]:hover{background-color:#f8ff23}.main[_ngcontent-%COMP%]{overflow:hidden;position:relative}.black-block[_ngcontent-%COMP%]{position:absolute;width:477px;height:910px;top:0;background-color:#0c0c0c;z-index:-2;right:calc(50% - 780px)}.header[_ngcontent-%COMP%]{padding:46px 0}.header[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{display:flex;align-items:center}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:129px;vertical-align:bottom}.menu[_ngcontent-%COMP%]{margin-left:177px;margin-right:auto}.menu[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style:none;display:flex;gap:65px}.menu[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{font-size:14px;color:#fff;font-weight:700;text-decoration:none;text-transform:uppercase}.menu[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#f8ff23}.phone[_ngcontent-%COMP%]{font-size:14px;font-weight:700;color:#fff;text-decoration:none;cursor:pointer;letter-spacing:normal}.main-content[_ngcontent-%COMP%]{padding-top:100px;padding-bottom:175px}.main-content[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{position:relative}.main-info[_ngcontent-%COMP%]{max-width:755px}.main-info[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:80px;font-weight:400;line-height:100%;margin-bottom:40px}.main-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:24px;line-height:120%;color:#d4d4d4;max-width:440px;margin-bottom:60px}.main-image[_ngcontent-%COMP%]{position:absolute;top:78px;right:-576px;z-index:-1}.cars[_ngcontent-%COMP%]{background-color:#000;padding:130px 0}.cars[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:65px;font-weight:400}.cars-content[_ngcontent-%COMP%]{display:flex;padding-top:60px}.cars-filter[_ngcontent-%COMP%]{margin-right:77px;align-self:flex-start;position:sticky;top:20px}.cars-filter[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{display:flex;flex-direction:column;row-gap:15px;list-style:none}.cars-filter[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{width:127px;padding:16px;text-align:center;border:1px solid white;font-size:16px;color:#fff;box-sizing:border-box;cursor:pointer;outline:none}.cars-filter[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%], .cars-filter[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover{color:#f8ff23;border-color:#f8ff23}.cars-items[_ngcontent-%COMP%]{display:flex;flex-direction:column;row-gap:30px}.car[_ngcontent-%COMP%]{background-color:#212121;padding:20px;display:flex}.car[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:568px}.car-details[_ngcontent-%COMP%]{margin-left:24px;display:flex;flex-direction:column}.car-details[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:30px;line-height:120%;margin-bottom:20px}.car-details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:16px;line-height:120%;letter-spacing:normal;color:#d4d4d4;height:100px}.car-action[_ngcontent-%COMP%]{margin-top:auto}.car-action[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style:none;display:flex;justify-content:space-between;margin-bottom:20px}.car-period[_ngcontent-%COMP%]{font-size:16px;line-height:120%;color:#d4d4d4;margin-bottom:5px}.car-price[_ngcontent-%COMP%]{font-size:24px;line-height:120%}.car-price[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:16px;line-height:120%;color:#d4d4d4}.car-action[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]{width:100%}.order[_ngcontent-%COMP%]{padding-top:159px;padding-bottom:130px}.order[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{position:relative}.order[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;top:-25px;left:-530px}.order[_ngcontent-%COMP%]   form[_ngcontent-%COMP%]{margin-left:714px;max-width:486px}.order[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:400;font-size:65px;line-height:100%;margin-bottom:40px}.order[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:24px;line-height:120%;color:#d4d4d4;margin-bottom:60px;max-width:445px}.order-form[_ngcontent-%COMP%]{width:344px}[_ngcontent-%COMP%]::placeholder{color:#d4d4d4}.order-form[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;height:68px;padding:24px 20px;box-sizing:border-box;color:#fff;border:1px solid #ffffff;background-color:transparent;margin-bottom:15px;font-size:16px;outline:none}.order-form[_ngcontent-%COMP%]   input.error[_ngcontent-%COMP%]{border-color:red}.footer[_ngcontent-%COMP%]{padding:47px 0;border-top:1px solid #5f5f5f}.footer[_ngcontent-%COMP%]   .container[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.rights[_ngcontent-%COMP%]{font-size:14px;line-height:90%;letter-spacing:normal;font-weight:700;text-transform:uppercase}',
        ],
      });
    }
  }
  return e;
})();
var Wv = (() => {
  class e {
    constructor() {
      this.name = 'Angular';
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵcmp = zr({
        type: e,
        selectors: [['app-root']],
        decls: 1,
        vars: 0,
        template: function (r, o) {
          r & 1 && me(0, 'app-cars');
        },
        dependencies: [Ud],
        encapsulation: 2,
      });
    }
  }
  return e;
})();
dd(Wv, { providers: [td()] });
export { Wv as App };
